const queryGetEstimate = `query GetCarsDetailsExtension($model: String!, $year: String!, $fuelType: String!, $transmissionType: String!, $variantName: String, $company: String!) {
    getCarsDetailsExtension(model: $model, year: $year, fuelType: $fuelType, transmissionType: $transmissionType, variantName: $variantName, company: $company) {
      actualPrice
      estimatedPrice
      variant {
        text
        value
      }
    }
  }
  `;
export default queryGetEstimate;
