// CDS Connect Commons for FHIRv102
// Change log:
// - 1.0.1
//   - Remove NullSafe conversion functions since FHIRHelpers now does null-safe conversions
//   - Note functions that exist in DSTU2 version of commons, but not here in STU3 version
library CDS_Connect_Commons_for_FHIRv300 version '1.0.1'

using FHIR version '3.0.0'

// Include the FHIRHelpers library for simplifying interacton w/ the FHIR data model
include FHIRHelpers version '3.0.0' called FHIRHelpers

// -------------------------------------------------- OBSERVATIONS -----------------------------------------------------

/**
 * Filters Observations by a concept rather than by a ValueSet.  In CQL 1.3, this will be built into the retrieve,
 * but for now, we must use a query where clause.
 * @param Koncept - the concept to filter on (intentionally mispelled to avoid naming clashes)
 * @returns {List<Observation>} a list of Observations matching the concept, or null if null was passed in
 */
define function ObservationsByConcept(Koncept System.Concept):
  [Observation] O where FHIRHelpers.ToConcept(O.code) ~ Koncept

/**
 * Observations that are complete and verified. In FHIR STU3, there are two statuses that indicate this state: 'final',
 * 'corrected', and 'amended'.
 * @see http://hl7.org/fhir/STU3/valueset-observation-status.html
 * @param ObsList - a list of Observations
 * @returns {List<Observation>} a list of verified Observations, or null if null was passed in
 */
define function Verified(ObsList List<Observation>):
  ObsList O where O.status.value in {'final', 'corrected', 'amended'}

/**
 * Observations that have quantity values recorded in the requested unit.
 * @param ObsList - a list of Observations
 * @param Unit - the unit to require in the Observations quantity value
 * @returns {List<Observation>} a list of Observations with the required unit, or null if null was passed in
 */
define function WithUnit(ObsList List<Observation>, Unit String):
  ObsList O
    where (O.value as FHIR.Quantity).unit.value = Unit or (O.value as FHIR.Quantity).code.value = Unit

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
    where (O.effective as FHIR.dateTime).value in LookBackInterval
      or FHIRHelpers.ToInterval(O.effective as FHIR.Period) overlaps LookBackInterval
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
  Last(ObsList O sort by Coalesce((effective as FHIR.dateTime).value, (effective as FHIR.Period)."end".value, (effective as FHIR.Period)."start".value, issued.value))

/**
 * Extracts the quantity value from an Observation, returning it as a CQL Quantity
 * @param Obs - an observation
 * @returns {System.Quantity} the Observation's value as a quantity, or null if there is no quantity value
 */
define function QuantityValue(Obs Observation):
  FHIRHelpers.ToQuantity(Obs.value as FHIR.Quantity)

/**
 * Extracts the CodeableConcept value from an Observation, returning it as a CQL Concept
 * @param Obs - an observation
 * @returns {System.Concept} the Observation's value as a concept, or null if there is no CodeabeConcept value
 */
define function ConceptValue(Obs Observation):
  FHIRHelpers.ToConcept(Obs.value as FHIR.CodeableConcept)

/**
 * Finds the first non-null meaningful date that can be associated with this Observation.  This will look through the
 * following fields in the following order: effectiveDateTime, effectivePeriod.end, effectivePeriod.start, issued.
 * @param Obs - an Observation
 * @returns {System.DateTime} the first non-null meaningful date, or null if non is found
 */
define function FindDate(Obs Observation):
  Coalesce((Obs.effective as FHIR.dateTime).value, (Obs.effective as FHIR.Period)."end".value, (Obs.effective as FHIR.Period)."start".value, Obs.issued.value)

// TODO: Confirm that this works as expected
/**
 * The highest observation.
 * The value will be used to compare Observations and determine the highest one.
 * @param ObsList - a list of Observations
 * @returns {System.Quantity} the quantity with the highest value from the list, or null if null was passed in
 */
define function HighestObservation(ObsList List<Observation>):
  Max(ObsList O return FHIRHelpers.ToQuantity(O.value as FHIR.Quantity))


// -------------------------------------------------- CONDITIONS -------------------------------------------------------

/**
 * Filters Conditions by a concept rather than by a ValueSet.  In CQL 1.3, this will be built into the retrieve,
 * but for now, we must use a query where clause.
 * @param Koncept - the concept to filter on (intentionally mispelled to avoid naming clashes)
 * @returns {List<Observation>} a list of Conditions matching the concept, or null if null was passed in
 */
define function ConditionsByConcept(Koncept System.Concept):
  [Condition] C where FHIRHelpers.ToConcept(C.code) ~ Koncept

/**
 * Conditions that are confirmed. In FHIR STU3, this is reflected by verificationStatus: 'confirmed'.
 * @see http://hl7.org/fhir/STU3/valueset-condition-ver-status.html
 * @param CondList - a list of Conditions
 * @returns {List<Condition>} a list of confirmed Conditions, or null if null was passed in
 */
define function Confirmed(CondList List<Condition>):
  CondList C where C.verificationStatus.value = 'confirmed'

/**
 * Conditions that are active. In FHIR STU3, this is reflected by clinicalStatus: 'active' and the absence of any
 * abatement information (i.e., if it abated, it is no longer active).
 * TODO: Rename to Active once the execution engine supports overloaded functions.
 * @see http://hl7.org/fhir/STU3/valueset-condition-clinical.html
 * @param CondList - a list of Conditions
 * @returns {List<Condition>} a list of active Conditions, or null if null was passed in
 */
define function ActiveCondition(CondList List<Condition>):
  CondList C
    where C.clinicalStatus.value = 'active'
      and (
        C.abatement is null
        or (C.abatement as FHIR.boolean).value is not true
      )

/**
 * Conditions that are active or recurring. In FHIR STU3, this is reflected by clinicalStatus: 'active' or 'relapse'.
 * We do not check for null abatement information because it may have dates from when the now recurring condition
 * initially went into remission.
 * @see http://hl7.org/fhir/STU3/valueset-condition-clinical.html
 * @param CondList - a list of Conditions
 * @returns {List<Condition>} a list of active or recurring Conditions, or null if null was passed in
 */
define function ActiveOrRecurring(CondList List<Condition>):
  CondList C where C.clinicalStatus.value in {'active', 'relapse'}

/**
 * Conditions with an onset or recorded date in the specified "look back" period.  For example, pregnancy in
 * the last 42 weeks.
 * TODO: Rename to LookBack once the execution engine supports overloaded functions.
 * @param CondList - a list of Conditions
 * @returns {List<Condition>} a list of Conditions with onset or recorded date specified lookback period, or null
 * if null was passed in
 */
define function ConditionLookBack(CondList List<Condition>, LookBack System.Quantity):
  CondList C
    let LookBackInterval: Interval[Now() - LookBack, Now()]
    where (C.onset as FHIR.dateTime).value in LookBackInterval
      or FHIRHelpers.ToInterval(C.onset as FHIR.Period) overlaps LookBackInterval
      or C.assertedDate in LookBackInterval

/**
 * The most recent condition.  For each Condition, this algorithm will use the Coalesce function, which uses the
 * first non-null result from these fields: onsetDateTime, onsetPeriod.end, onsetPeriod.start, assertedDate.
 * The found date will be used to compare Conditions and determine the most recent one.
 * @param CondList - a list of Conditions
 * @returns {Condition} the most recent Condition from the list, or null if null was passed in
 */
define function MostRecentCondition(CondList List<Condition>):
  Last(CondList C sort by Coalesce((onset as FHIR.dateTime).value, (onset as FHIR.Period)."end".value, (onset as FHIR.Period)."start".value, assertedDate.value))

 // -------------------------------------------------- PROCEDURES ------------------------------------------------------

 /**
  * Filters Procedures by a concept rather than by a ValueSet.  In CQL 1.3, this will be built into the retrieve,
  * but for now, we must use a query where clause.
  * @param Koncept - the concept to filter on (intentionally mispelled to avoid naming clashes)
  * @returns {List<Procedure>} a list of Procedures matching the concept, or null if null was passed in
  */
 define function ProceduresByConcept(Koncept System.Concept):
   [Procedure] P where FHIRHelpers.ToConcept(P.code) ~ Koncept

/**
 * Procedures that are completed. In FHIR STU3, this is reflected by status: 'completed'.  In addition, the
 * notDone flag must be checked to ensure it is not 'true'.
 * @see https://www.hl7.org/fhir/STU3/valueset-event-status.html
 * @param ProcList - a list of Procedures
 * @returns {List<Procedure>} a list of completed Procedures, or null if null was passed in
 */
define function Completed(ProcList List<Procedure>):
  ProcList P
    where P.status.value = 'completed'
      and P.notDone.value is not true

/**
 * Procedures that are in progress. In FHIR STU3, this is reflected by status: 'in-progress'.  In addition, the
 * notDone flag must be checked to ensure it is not 'true'.
 * @see https://www.hl7.org/fhir/STU3/valueset-event-status.html
 * @param ProcList - a list of Procedures
 * @returns {List<Procedure>} a list of completed Procedures, or null if null was passed in
 */
define function ProcedureInProgress(ProcList List<Procedure>):
  ProcList P
    where P.status.value = 'in-progress'
      and P.notDone.value is not true

// NOTE: The DSTU2 commons also has ProcedurePerformance, but we do not use that in the CDS Authoring Tool.

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
    where (P.performed as FHIR.dateTime).value in LookBackInterval
      or FHIRHelpers.ToInterval(P.performed as FHIR.Period) overlaps LookBackInterval

/**
 * The most recent procedure.  For each Procedure, this algorithm will use the Coalesce function, which returns the
 * first non-null result from these fields: performedDateTime, performedPeriod.end, performedPeriod.start.
 * The found date will be used to compare Procedures and determine the most recent one.
 * @param ProcList - a list of Procedures
 * @returns {Procedure} the most recent Procedure from the list, or null if null was passed in
 */
define function MostRecentProcedure(ProcList List<Procedure>):
  Last(ProcList P sort by Coalesce((performed as FHIR.dateTime).value, (performed as FHIR.Period)."end".value, (performed as FHIR.Period)."start".value))

// NOTE: The DSTU2 commons also has functions for ProcedureRequests, but we do not use them in the CDS Authoring Tool.

// NOTE: The DSTU2 commons also has functions for ReferralRequests, but we do not use them in the CDS Authoring Tool.

// -------------------------------------------------- MEDICATIONS ------------------------------------------------------

/**
 * Filters MedicationStatements by a concept rather than by a ValueSet.  In CQL 1.3, this will be built into the retrieve,
 * but for now, we must use a query where clause.
 * @param Koncept - the concept to filter on (intentionally mispelled to avoid naming clashes)
 * @returns {List<MedicationStatement>} a list of MedicationStatement matching the concept, or null if null was passed in
 */
define function MedicationStatementsByConcept(Koncept System.Concept):
  [MedicationStatement] M where FHIRHelpers.ToConcept(M.medication as FHIR.CodeableConcept) ~ Koncept

/**
 * Filters MedicationRequests by a concept rather than by a ValueSet.  In CQL 1.3, this will be built into the retrieve,
 * but for now, we must use a query where clause.
 * @param Koncept - the concept to filter on (intentionally mispelled to avoid naming clashes)
 * @returns {List<MedicationRequest>} a list of MedicationRequests matching the concept, or null if null was passed in
 */
define function MedicationRequestsByConcept(Koncept System.Concept):
  [MedicationRequest] M where FHIRHelpers.ToConcept(M.medication as FHIR.CodeableConcept) ~ Koncept

/**
 * Medications that are active, according to a statement, but not necessarily verified via a prescription.  For example,
 * medications that a patient has self-reported to be taking.  In FHIR STU3, this is reflected by MedicationStatement
 * with status 'active', no flag indicating it wasn't taken, and no end date or an end date in the future.
 * TODO: Rename to Active once the execution engine supports overloaded functions.
 * @see http://hl7.org/fhir/STU3/valueset-medication-statement-status.html
 * @param MedList - a list of MedicationStatements
 * @returns {List<MedicationStatement>} a list of active medication statements, or null if null was passed in
 */
define function ActiveMedicationStatement(MedList List<MedicationStatement>):
  MedList M
    let EffectivePeriod: FHIRHelpers.ToInterval(M.effective as FHIR.Period)
    where M.status.value = 'active'
      and M.taken.value = 'y'
      and (end of EffectivePeriod is null or end of EffectivePeriod after Now())

/**
* Medications that are active, according to a prescription.  In FHIR STU3, this is reflected by MedicationRequest
* with status 'active'.  There is currently an open question in the FHIR chat to determine if this
* is the right approach.
* TODO: Revisit based on outcome of FHIR chat.
* TODO: Rename to Active once the execution engine supports overloaded functions.
* @see https://chat.fhir.org/#narrow/stream/implementers/topic/Meaning.20of.20.22active.22.20and.20.22completed.22.20in.20MedicationRequest
* @see https://www.hl7.org/fhir/STU3/valueset-medication-request-status.html
* @param MedList - a list of MedicationRequests
* @returns {List<MedicationRequest>} a list of active medication requests, or null if null was passed in
*/
define function ActiveMedicationRequest(MedList List<MedicationRequest>):
  MedList M where M.status.value = 'active'

/**
* Medications that are active or completed, according to a prescription.  In FHIR STU3, this is reflected by MedicationRequest
* with status 'active' or 'completed'
* @see https://www.hl7.org/fhir/STU3/valueset-medication-request-status.html
* @param MedList - a list of MedicationRequests
* @returns {List<MedicationRequest>} a list of active medication requests, or null if null was passed in
*/
define function ActiveOrCompletedMedicationRequest(MedList List<MedicationRequest>):
  MedList M
    where M.status.value = 'active'
      or M.status.value = 'completed'

// NOTE: The DSTU2 commons also has ActiveCompletedOrStoppedMedicationOrder, but we do not use that in the CDS Authoring Tool.

/**
* Medication requests that are issued in the specified "look back" period.
* TODO: Rename to LookBack once the execution engine supports overloaded functions.
* @param MedList - a list of Medications
* @param LookBack - the lookback period for when the medication was prescribed
* @returns {List<MedicationRequest>} a list of Medications prescribed in the look back period, or null if null
* was passed in
*/
define function MedicationRequestLookBack(MedList List<MedicationRequest>, LookBack System.Quantity):
MedList M
  let LookBackInterval: Interval[Now() - LookBack, Now()]
  where M.authoredOn.value in LookBackInterval

/**
* Medication Statements that are issued in the specified "look back" period.
* TODO: Rename to LookBack once the execution engine supports overloaded functions.
* @param MedList - a list of Medications
* @param LookBack - the lookback period for when the medication was prescribed
* @returns {List<MedicationStatement>} a list of Medications prescribed in the look back period, or null if null
* was passed in
*/
define function MedicationStatementLookBack(MedList List<MedicationStatement>, LookBack System.Quantity):
MedList M
  let LookBackInterval: Interval[Now() - LookBack, Now()]
  where (M.effective as FHIR.dateTime).value in LookBackInterval
    or FHIRHelpers.ToInterval(M.effective as FHIR.Period) overlaps LookBackInterval

// -------------------------------------------------- ENCOUNTERS ------------------------------------------------------

/**
 * Filters Encounters by a concept rather than by a ValueSet.  In CQL 1.3, this will be built into the retrieve,
 * but for now, we must use a query where clause.
 * @param Koncept - the concept to filter on (intentionally mispelled to avoid naming clashes)
 * @returns {List<Encounter>} a list of Encounters matching the concept, or null if null was passed in
 */
define function EncountersByConcept(Koncept System.Concept):
  [Encounter] E where exists( (E.type) ET where FHIRHelpers.ToConcept(ET) ~ Koncept )

/**
 * Encounters that are in progress. In FHIR STU3, this is reflected by status: 'in-progress'.
 * @see http://hl7.org/fhir/STU3/valueset-encounter-status.html
 * @param EncList - a list of Encounters
 * @returns {List<Encounter>} a list of in progress encounters, or null if null was passed in
 */
define function InProgress(EncList List<Encounter>):
  EncList E
    where E.status.value = 'in-progress'

// -------------------------------------------------- ALLERGY INTOLERANCES ------------------------------------------------------

/**
 * Filters AllergyIntolerances by a concept rather than by a ValueSet.  In CQL 1.3, this will be built into the retrieve,
 * but for now, we must use a query where clause.
 * @param Koncept - the concept to filter on (intentionally mispelled to avoid naming clashes)
 * @returns {List<AllergyIntolerance>} a list of Allergy Intolerances matching the concept, or null if null was passed in
 */
define function AllergyIntolerancesByConcept(Koncept System.Concept):
  [AllergyIntolerance] A where FHIRHelpers.ToConcept(A.code) ~ Koncept

/**
* AllergyIntolerances that are active or confirmed.  In FHIR STU3, this is reflected by AllergyIntolerance
* with clinicalStatus 'active' or verificationStatus 'confirmed'
* @see https://www.hl7.org/fhir/STU3/valueset-allergy-clinical-status.html
* @see https://www.hl7.org/fhir/STU3/valueset-allergy-verification-status.html
* @param AllergyIntolList - a list of AllergyIntolerances
* @returns {List<AllergyIntolerance>} a list of active or confirmed allergy intolerances, or null if null was passed in
*/
define function ActiveOrConfirmedAllergyIntolerance(AllergyIntolList List<AllergyIntolerance>):
  AllergyIntolList A
    where A.clinicalStatus.value = 'active'
      or A.verificationStatus.value = 'confirmed'

// NOTE: The DSTU2 commons also has GoalLookBack, but we do not use that in the CDS Authoring Tool.
