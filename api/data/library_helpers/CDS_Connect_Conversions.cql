/**
 * This library supports conversions from one unit to another.  Conversions are added as needed by artifacts in
 * development.  Since case is important for some units, rather than use our normal PascalCasing, we use underscore
 * to separate words and maintain casing.  For example, to convert to "mg/dL", rather than call the function
 * `ToMgPerDL`, we call it `to_mg_per_dL`, in order to maintain casing.
 */
library CDS_Connect_Conversions version '1'

/**
 * Converts mmol/L to mg/dL, or if already md/dL, leaves it as is.  If an unrecognized unit is used, null is returned.
 * @param Q - a Quantity
 * @returns {Quantity} a Quantity using mg/dL units or null if null was passed in or unit couldn't be converted
 */
define function to_mg_per_dL (Q Quantity):
  case
    when Q.unit = 'mg/dL' then Q
    when Q.unit = 'mmol/L' then Quantity{value: Q.value * 38.66976, unit: 'mg/dL'}
    else null
  end
