'use server';

export async function checkPincodeServicability(pincode: string): Promise<{ serviceable: boolean; message: string }> {
  const token = process.env.DELHIVERY_API_TOKEN;
  if (!token) {
    console.error('Delhivery API token is not configured.');
    return { serviceable: false, message: 'Configuration error. Please contact support.' };
  }

  const url = `https://track.delhivery.com/c/api/pin-codes/json/?filter_codes=${pincode}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`Delhivery API error: ${response.status} ${response.statusText}`);
      return { serviceable: false, message: 'Could not connect to the delivery service.' };
    }

    const data = await response.json();
    
    // According to docs, an empty list means non-serviceable.
    if (!data || !data.delivery_codes || data.delivery_codes.length === 0) {
      return { serviceable: false, message: 'This pincode is not serviceable.' };
    }

    const pincodeData = data.delivery_codes[0];
    const postalCode = pincodeData.postal_code;

    // "Embargo" indicates temporary non-serviceability
    if (postalCode.sort_code === 'Embargo') {
        return { serviceable: false, message: 'Service to this pincode is temporarily unavailable.' };
    }
    
    // Check if Prepaid is 'N'. If it is, then it's not serviceable for our store.
    if (postalCode.pre_paid === 'N') {
      return { serviceable: false, message: 'Delivery is not available for this pincode.' };
    }

    return { serviceable: true, message: 'This pincode is serviceable.' };

  } catch (error) {
    console.error('Error checking pincode serviceability:', error);
    return { serviceable: false, message: 'An unexpected error occurred while checking serviceability.' };
  }
}
