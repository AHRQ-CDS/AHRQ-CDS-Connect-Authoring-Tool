library CDS_Connect_Commons_for_FHIRv102 version '1'

using FHIR version '1.0.2'

// Include the FHIRHelpers library for simplifying interacton w/ the FHIR data model
include FHIRHelpers version '1.0.2' called FHIRHelpers

// -------------------------------------------------- GENERAL ---------------------------------------------------------

/**
 * A null-safe version of ToConcept.  Whereas FHIRHelpers.ToConcept will take a null argument and produce a
 * System.Concept that is empty, this implementation returns null instead.
 * @param C - a FHIR CodeableConcept
 * @returns {System.Concept} a CQL Concept or null if null was passed in
 */
define function NullSafeToConcept(C FHIR.CodeableConcept):
  if C is not null then FHIRHelpers.ToConcept(C) else null

/**
 * A null-safe version of ToInterval.  Whereas FHIRHelpers.ToInterval will take a null argument and produce a
 * System.Interval that is empty, this implementation returns null instead.
 * @param P - a FHIR Period
 * @returns {System.Interval} a CQL Interval or null if null was passed in
 */
define function NullSafeToInterval(P FHIR.Period):
  if P is not null then FHIRHelpers.ToInterval(P) else null

/**
 * A null-safe version of ToQuantity.  Whereas FHIRHelpers.ToQuantity will take a null argument and produce a
 * System.Quantity that is empty, this implementation returns null instead.
 * @param C - a FHIR Quantity
 * @returns {System.Quantity} a CQL Quantity or null if null was passed in
 */
define function NullSafeToQuantity(Q FHIR.Quantity):
  if Q is not null then
    System.Quantity {
      value: Q.value.value,
      unit: Coalesce(Q.unit.value, Q.code.value)
    }
  else null

// -------------------------------------------------- OBSERVATIONS -----------------------------------------------------

/**
 * Filters Observations by a concept rather than by a ValueSet.  In CQL 1.3, this will be built into the retrieve,
 * but for now, we must use a query where clause.
 * @param Koncept - the concept to filter on (intentionally mispelled to avoid naming clashes)
 * @returns {List<Observation>} a list of Observations matching the concept, or null if null was passed in
 */
define function ObservationsByConcept(Koncept System.Concept):
  [Observation] O where NullSafeToConcept(O.code) ~ Koncept

/**
 * Observations that are complete and verified. In FHIR DSTU2, there are two statuses that indicate this state: 'final'
 * and 'amended'.
 * @see http://hl7.org/fhir/DSTU2/valueset-observation-status.html
 * @param ObsList - a list of Observations
 * @returns {List<Observation>} a list of verified Observations, or null if null was passed in
 */
define function Verified(ObsList List<Observation>):
  ObsList O where O.status.value in {'final', 'amended'}

/**
 * Observations that have quantity values recorded in the requested unit.
 * @param ObsList - a list of Observations
 * @param Unit - the unit to require in the Observations quantity value
 * @returns {List<Observation>} a list of Observations with the required unit, or null if null was passed in
 */
define function WithUnit(ObsList List<Observation>, Unit String):
  ObsList O where O.valueQuantity.unit.value = Unit or O.valueQuantity.code.value = Unit

/**
 * Observations with an effective or issued date in the specified "look back" period.  For example, LDL-C Tests in the
 * last 6 years.
 * TODO: Rename to LookBack once the execution engine supports overloaded functions.
 * @param ObsList - a list of Observations
 * @returns {List<Observation>} a list of Observations with effective or issued date specified lookback period, or null
 * if null was passed in
 */
define function ObservationLookBack(ObsList List<Observation>, LookBack System.Quantity):
  ObsList O
    let LookBackInterval: Interval[Now() - LookBack, Now()]
    where O.effectiveDateTime.value in LookBackInterval
      or NullSafeToInterval(O.effectivePeriod) overlaps LookBackInterval
      or O.issued in LookBackInterval

/**
 * The most recent observation.  For each Observation, this algorithm will use the FindDate function, which uses the
 * first non-null date value from these fields: effectiveDateTime, effectivePeriod.end, effectivePeriod.start, issued.
 * The found date will be used to compare Observations and determine the most recent one.
 * @see FindDate(Observation)
 * @param ObsList - a list of Observations
 * @returns {Observation} the most recent Observation from the list, or null if null was passed in
 */
define function MostRecent(ObsList List<Observation>):
  Last(ObsList O sort by FindDate(O))

/**
 * Extracts the quantity value from an Observation, returning it as a CQL Quantity
 * @param Obs - an observation
 * @returns {System.Quantity} the Observation's value as a quantity, or null if there is no quantity value
 */
define function QuantityValue(Obs Observation):
  NullSafeToQuantity(Obs.valueQuantity)

/**
 * Extracts the CodeableConcept value from an Observation, returning it as a CQL Concept
 * @param Obs - an observation
 * @returns {System.Concept} the Observation's value as a concept, or null if there is no CodeabeConcept value
 */
define function ConceptValue(Obs Observation):
  NullSafeToConcept(Obs.valueCodeableConcept)

/**
 * Finds the first non-null meaningful date that can be associated with this Observation.  This will look through the
 * following fields in the following order: effectiveDateTime, effectivePeriod.end, effectivePeriod.start, issued.
 * @param Obs - an Observation
 * @returns {System.DateTime} the first non-null meaningful date, or null if non is found
 */
define function FindDate(Obs Observation):
  Coalesce(Obs.effectiveDateTime.value, Obs.effectivePeriod."end".value, Obs.effectivePeriod."start".value, Obs.issued.value)

// -------------------------------------------------- CONDITIONS -------------------------------------------------------

/**
 * Conditions that are confirmed. In FHIR DSTU2, this is reflected by verificationStatus: 'confirmed'.
 * @see http://hl7.org/fhir/DSTU2/valueset-condition-ver-status.html
 * @param CondList - a list of Conditions
 * @returns {List<Condition>} a list of confirmed Conditions, or null if null was passed in
 */
define function Confirmed(CondList List<Condition>):
  CondList C where C.verificationStatus.value = 'confirmed'

/**
 * Conditions that are active. In FHIR DSTU2, this is reflected by clinicalStatus: 'active' and the absence of any
 * abatement information (i.e., if it abated, it is no longer active).
 * TODO: Rename to Active once the execution engine supports overloaded functions.
 * @see http://hl7.org/fhir/DSTU2/valueset-condition-clinical.html
 * @param CondList - a list of Conditions
 * @returns {List<Condition>} a list of active Conditions, or null if null was passed in
 */
define function ActiveCondition(CondList List<Condition>):
  CondList C
    where C.clinicalStatus.value = 'active'
      and C.abatementDateTime is null
      and C.abatementQuantity is null
      and C.abatementBoolean.value is not true
      and C.abatementPeriod is null
      and C.abatementRange is null
      and C.abatementString is null

/**
 * Conditions that are active or recurring. In FHIR DSTU2, this is reflected by clinicalStatus: 'active' or 'relapse'.
 * We do not check for null abatement information because it may have dates from when the now recurring condition
 * initially went into remission.
 * @see http://hl7.org/fhir/DSTU2/valueset-condition-clinical.html
 * @param CondList - a list of Conditions
 * @returns {List<Condition>} a list of active or recurring Conditions, or null if null was passed in
 */
define function ActiveOrRecurring(CondList List<Condition>):
  CondList C where C.clinicalStatus.value in {'active', 'relapse'}

 // -------------------------------------------------- PROCEDURES ------------------------------------------------------

/**
 * Procedures that are completed. In FHIR DSTU2, this is reflected by status: 'completed'.  In addition, the
 * notPerformed flag must be checked to ensure it is not 'true'.
 * @see http://hl7.org/fhir/DSTU2/valueset-procedure-status.html
 * @param ProcList - a list of Procedures
 * @returns {List<Procedure>} a list of completed Procedures, or null if null was passed in
 */
define function Completed(ProcList List<Procedure>):
  ProcList P
    where P.status.value = 'completed'
      and P.notPerformed.value is not true

/**
 * Procedures performed in the specified "look back" period.  For example, PCIs performed in the
 * past 2 weeks.
 * TODO: Rename to LookBack once the execution engine supports overloaded functions.
 * @param ProcList - a list of Procedures
 * @param LookBack - the lookback period for when the procedure was performed
 * @returns {List<Procedure>} a list of Procedures performed in the look back period, or null if null
 * was passed in
 */
define function ProcedureLookBack(ProcList List<Procedure>, LookBack System.Quantity):
  ProcList P
    let LookBackInterval: Interval[Now() - LookBack, Now()]
    where P.performedDateTime.value in LookBackInterval
      or NullSafeToInterval(P.performedPeriod) overlaps LookBackInterval

// -------------------------------------------------- MEDICATIONS ------------------------------------------------------

/**
 * Medications that are active, according to a statement, but not necessarily verified via a prescription.  For example,
 * medications that a patient has self-reported to be taking.  In FHIR DSTU2, this is reflected by MedicationStatement
 * with status 'active', no flag indicating it wasn't taken, and no end date or an end date in the future.
 * TODO: Rename to Active once the execution engine supports overloaded functions.
 * @see http://hl7.org/fhir/DSTU2/valueset-medication-statement-status.html
 * @param MedList - a list of MedicationStatements
 * @returns {List<MedicationStatement>} a list of active medication statements, or null if null was passed in
 */
define function ActiveMedicationStatement(MedList List<MedicationStatement>):
  MedList M
    let EffectivePeriod: NullSafeToInterval(M.effectivePeriod)
    where M.status.value = 'active'
      and M.wasNotTaken.value is not true
      and (end of EffectivePeriod is null or end of EffectivePeriod after Now())

/**
* Medications that are active, according to a prescription.  In FHIR DSTU2, this is reflected by MedicationOrder
* with status 'active' and no dateEnded.  There is currently an open question in the FHIR chat to determine if this
* is the right approach.
* TODO: Revisit based on outcome of FHIR chat.
* TODO: Rename to Active once the execution engine supports overloaded functions.
* @see https://chat.fhir.org/#narrow/stream/implementers/topic/Meaning.20of.20.22active.22.20and.20.22completed.22.20in.20MedicationRequest
* @see http://hl7.org/fhir/DSTU2/valueset-medication-order-status.html
* @param MedList - a list of MedicationOrders
* @returns {List<MedicationOrder>} a list of active medication orders, or null if null was passed in
*/
define function ActiveMedicationOrder(MedList List<MedicationOrder>):
  MedList M
    where M.status.value = 'active'
      and M.dateEnded.value is null
