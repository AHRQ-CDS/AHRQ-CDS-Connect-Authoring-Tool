library "Intervals" version '1'

using FHIR version '3.0.0'

include FHIRHelpers version '3.0.0' called FHIRHelpers

include CDS_Connect_Commons_for_FHIRv300 version '1.0.0' called C3F

include CDS_Connect_Conversions version '1' called Convert

parameter "Integer" Interval<Integer>
parameter "DateTime" Interval<DateTime>
parameter "Decimal" Interval<Decimal>
parameter "Quantity" Interval<Quantity>

context Patient

define function ActiveMedicationStatement(MedList List<MedicationStatement>):
  MedList M
    let EffectivePeriod: NullSafeToInterval(M.effectivePeriod)
    where M.status.value = 'active'
      and M.wasNotTaken.value is not true
      and (end of EffectivePeriod is null or end of EffectivePeriod after Now())

define "Integera":
  "Integer" after 123

define "MeetsInclusionCriteria":
  "Integera"

define "InPopulation":
   "MeetsInclusionCriteria"

define "Recommendation":
  null

define "Rationale":
  null
define "Errors":
  null
