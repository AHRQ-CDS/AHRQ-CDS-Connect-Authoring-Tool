/* eslint max-len: ["error", 130] */
import React, { Component } from 'react';
import tocbot from 'tocbot';
import _ from 'lodash';

export default class DataTypeGuide extends Component {
  componentDidMount() {
    tocbot.init({
      tocSelector: '.userguide-toc',
      contentSelector: '.userguide-wrapper',
      headingSelector: 'h1, h2, h3, h4',
      positionFixedSelector: '.userguide-toc',
      collapseDepth: 0 // 0 collapses 6 expands all
    });

    this.userGuide = document.querySelector('.userguide');
    this.userGuideStyle = window.getComputedStyle(this.userGuide);
    this.toc = document.querySelector('.userguide-toc');
    this.throttledScrollListener = _.throttle(this.scrollListener.bind(this), 50);

    document.addEventListener('scroll', this.throttledScrollListener, { passive: true });
    document.addEventListener('resize', this.throttledScrollListener, { passive: true });
  }

  componentWillUnmount() { // eslint-disable-line class-methods-use-this
    tocbot.destroy();

    document.removeEventListener('scroll', this.throttledScrollListener, { passive: true });
    document.removeEventListener('resize', this.throttledScrollListener, { passive: true });
  }

  scrollListener() {
    const { userGuide, toc } = this;
    const { bottom } = userGuide.getBoundingClientRect();
    const windowBottom = window.innerHeight || document.documentElement.clientHeight;

    if ((bottom + parseInt(this.userGuideStyle.paddingBottom, 10)) <= windowBottom) {
      toc.classList.add('at-bottom');
      userGuide.classList.add('is-position-relative');
    } else if (toc.classList.contains('at-bottom')) {
      toc.classList.remove('at-bottom');
      userGuide.classList.remove('is-position-relative');
    }
  }

  render() { // eslint-disable-line class-methods-use-this
    return (
      <div className="userguide" id="maincontent">
        <div className="userguide-toc toc" id="toc"></div>

        <div className="userguide-wrapper">
          <div className="userguide-guide">
            <h1 id="data-types-and-expressions">Data Types and Expressions</h1>

            <p>
              The following is a list of all data types available in the CDS Authoring Tool and the expressions
              available for each data type. Each expression describes the CQL function that is applied when the
              expression is used, briefly what the function does, and the the type that is returned after the expression
              is applied.
            </p>

            <p>
              Note: <code>C3F</code> refers to the CDS Connect Commons library. Any functions used from this library will be
              automatically embedded into the artifact's primary CQL library.
            </p>

            <p>
              Note: <code>Convert</code> refers to the CDS Connect Conversions library. Any functions used from this library will
              be automatically embedded into the artifact's primary CQL library.
            </p>

            <div className="h2-wrapper">
              <h2 id="any-type">Any Type</h2>

              <div className="h3-wrapper">
                <p>The following expressions can be applied to any data type:</p>
                <ul>
                  <li>Is (Not) Null?
                    <ul>
                      <li>CQL operator: <code>is null</code> or <code>is not null</code></li>
                      <li>
                        Summary: Checks if the current element is or is not <code>null</code>. In CQL,
                        {' '}<code>null</code> is used to indicate that something is absent or has an unknown value.
                      </li>
                      <li>Returns: Boolean</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>

            <div className="h2-wrapper">
              <h2 id="list-types">List Types</h2>

              <div className="h3-wrapper">
                <p>The following expressions can be applied to any list:</p>

                <ul>
                  <li>
                    Count
                    <ul>
                      <li>CQL function: <code>Count</code></li>
                      <li>Summary: Counts the number of items in the current list</li>
                      <li>Returns: Integer</li>
                    </ul>
                  </li>
                  <li>
                    Exists
                    <ul>
                      <li>CQL operator: <code>exists</code></li>
                      <li>
                        Summary: Checks if the list contains at least one item. If the list contains at least one item,
                        it returns <code>true</code>, otherwise it returns <code>false</code>
                      </li>
                      <li>Returns: Boolean</li>
                    </ul>
                  </li>
                  <li>
                    See expressions that can be applied to <a href="#any-type">any type</a>
                  </li>
                </ul>

                <p>Other expressions that can only be applied to specific types of lists are outlined below.</p>

                <h3 id="list-of-allergy-intolerances">List of Allergy Intolerances</h3>

                <ul>
                  <li>
                    Active Or Confirmed
                    <ul>
                      <li>CQL function: <code>C3F.ActiveOrConfirmedAllergyIntolerance</code></li>
                      <li>
                        Summary: Returns a list of allergy intolerances that are either active or confirmed
                        <ul>
                          <li>
                            In FHIR R4 and STU3, this returns allergy intolerances with <code>clinicalStatus</code> 'active'
                            or <code>verificationStatus</code> 'confirmed'
                          </li>
                          <li>
                            In FHIR DSTU2, this returns allergy intolerances with <code>status</code> 'active' or
                            'confirmed'
                          </li>
                        </ul>
                      </li>
                      <li>
                        Returns: List of Allergy Intolerances
                      </li>
                    </ul>
                  </li>
                  <li>
                    See expressions that can be applied to <a href="#list-types">any list</a>
                  </li>
                </ul>

                <h3 id="list-of-booleans">List of Booleans</h3>
                <ul>
                  <li>
                    All True
                    <ul>
                      <li>CQL function: <code>AllTrue</code></li>
                      <li>
                        Summary: Checks if every item in the list is <code>true</code>.  If so, it returns
                        {' '}<code>true</code>. Otherwise (if any item is not <code>true</code>), it returns <code>false</code>.
                      </li>
                      <li>Returns: Boolean</li>
                    </ul>
                  </li>
                  <li>
                    Any True
                    <ul>
                      <li>CQL function: <code>AnyTrue</code></li>
                      <li>
                        Summary: Checks if at least one item in the list is <code>true</code>. If so, it returns
                        {' '}<code>true</code>. Otherwise (if no item is <code>true</code>), it returns <code>false</code>.
                      </li>
                      <li>Returns: Boolean</li>
                    </ul>
                  </li>
                  <li>
                    See expressions that can be applied to <a href="#list-types">any list</a>
                  </li>
                </ul>

                <h3 id="list-of-conditions">List of Conditions</h3>

                <ul>
                  <li>
                    Active
                    <ul>
                      <li>
                        CQL function: <code>C3F.ActiveCondition</code>
                      </li>
                      <li>
                        Summary: Returns a list of conditions with <code>clinicalStatus</code>
                        and <code>abatement[x]</code> indicating active
                        <ul>
                          <li>
                            In FHIR R4, this returns conditions with <code>clinicalStatus</code> 'active'
                            {' '}or <code>abatement[x]</code> 'null'
                          </li>
                          <li>
                            In FHIR STU3 and DSTU2, this returns conditions with <code>clinicalStatus</code> 'active'
                            {' '}or <code>abatement[x]</code> 'null' or 'not true'
                          </li>
                        </ul>
                      </li>
                      <li>
                        Returns: List of Conditions
                      </li>
                    </ul>
                  </li>
                  <li>
                    Active Or Recurring
                    <ul>
                      <li>CQL function: <code>C3F.ActiveOrRecurring</code></li>
                      <li>
                        Summary: Returns a list of conditions with <code>clinicalStatus</code>
                        {' '}indicating active, recurring, or relapse
                        <ul>
                          <li>
                            In FHIR R4, this returns conditions with <code>clinicalStatus</code> 'active' or
                            {' '}'recurrence' or 'relapse'
                          </li>
                          <li>
                            In FHIR STU3 and DSTU2, this returns conditions with <code>clinicalStatus</code> 'active' or 'relapse'
                          </li>
                        </ul>
                      </li>
                      <li>Returns: List of Conditions</li>
                    </ul>
                  </li>
                  <li>
                    Confirmed
                    <ul>
                      <li>CQL function: <code>C3F.Confirmed</code></li>
                      <li>
                        Summary: Returns a list of conditions with <code>verificationStatus</code> 'confirmed'
                      </li>
                      <li>Returns: List of Conditions</li>
                    </ul>
                  </li>
                  <li>
                  Look Back
                    <ul>
                      <li>
                        CQL function: <code>C3F.ConditionLookBack</code>
                      </li>
                      <li>
                        Summary: Returns a list of conditions that occurred between now and the time period specified
                        by the user
                        <ul>
                          <li>
                            In FHIR R4, this returns conditions with <code>onset[x]</code> or <code>recordedDate</code>
                            {' '}that occurred within the period
                          </li>
                          <li>
                            In FHIR STU3, this returns conditions with <code>onset[x]</code> or <code>assertedDate</code>
                            {' '}that occurred within the period
                          </li>
                          <li>
                            In FHIR DSTU2, this returns conditions with <code>onset[x]</code> or <code>dateRecorded</code>
                            {' '}that occurred within the period
                          </li>
                        </ul>
                      </li>
                      <li>
                        Returns: List of Conditions
                      </li>
                    </ul>
                  </li>
                  <li>
                    Most Recent
                    <ul>
                      <li>
                        CQL function: <code>C3F.MostRecentCondition</code>
                      </li>
                      <li>
                        Summary: Returns the most recent condition from a list
                        <ul>
                          <li>
                            In FHIR R4, this sorts conditions using <code>onset[x]</code> and <code>recordedDate</code>
                            {' '}and returns the last condition from that list
                          </li>
                          <li>
                            In FHIR STU3, this sorts conditions using <code>onset[x]</code> and <code>assertedDate</code>
                            {' '}and returns the last condition from that list
                          </li>
                          <li>
                            In FHIR DSTU2, this sorts conditions using <code>onset[x]</code> and <code>dateRecorded</code>
                            {' '}and returns the last condition from that list
                          </li>
                        </ul>
                      </li>
                      <li>
                        Returns: Condition
                      </li>
                    </ul>
                  </li>
                  <li>
                    See expressions that can be applied to <a href="#list-types">any list</a>
                  </li>
                </ul>

                <h3 id="list-of-datetime">List of Datetime</h3>

                <ul>
                  <li>See expressions that can be applied to <a href="#list-types">any list</a></li>
                </ul>

                <h3 id="list-of-decimals">List of Decimals</h3>

                <ul>
                  <li>See expressions that can be applied to <a href="#list-types">any list</a></li>
                </ul>

                <h3 id="list-of-Devices">List of Devices</h3>

                <ul>
                  <li>Active
                    <ul>
                      <li>
                        CQL function: <code>C3F.ActiveDevice</code>
                      </li>
                      <li>
                        Summary: Returns a list of active devices. In FHIR, a device is considered "active" if it is available
                        for use. If it is an implanted device, this means it is implanted in the patient.
                        <ul>
                          <li>
                            In FHIR R4 and STU3, this returns devices with <code>status</code> of 'active'
                          </li>
                          <li>
                            In FHIR DSTU2, this returns devices with <code>status</code> of 'available'
                          </li>
                        </ul>
                      </li>
                      <li>
                        Returns: List of Devices
                      </li>
                    </ul>
                  </li>
                  <li>
                    See expressions that can be applied to <a href="#list-types">any list</a>
                  </li>
                </ul>

                <h3 id="list-of-encounters">List of Encounters</h3>

                <ul>
                  <li>In Progress
                    <ul>
                      <li>CQL function: <code>C3F.InProgress</code></li>
                      <li>Summary: Returns a list of encounters with <code>status</code> 'in-progress'</li>
                      <li>Returns: List of Encounters</li>
                    </ul>
                  </li>
                  <li>
                    See expressions that can be applied to <a href="#list-types">any list</a>
                  </li>
                </ul>

                <h3 id="list-of-Immunizations">List of Immunizations</h3>

                <ul>
                  <li>Completed
                    <ul>
                      <li>
                        CQL function: <code>C3F.CompletedImmunization</code>
                      </li>
                      <li>
                        Summary: Returns a list of immunizations that have been completed
                        <ul>
                          <li>
                            In FHIR R4, this returns immunizations with <code>status</code> of 'completed'
                          </li>
                          <li>
                            In FHIR STU3, this returns immunizations with <code>status</code> of 'completed'
                            and <code>notGiven</code> is 'not true'
                          </li>
                          <li>
                            In FHIR DSTU2, this returns immunizations with <code>status</code> of 'completed'
                            and <code>wasNotGiven</code> is 'not true'
                          </li>
                        </ul>
                      </li>
                      <li>
                        Returns: List of Immunizations
                      </li>
                    </ul>
                  </li>
                  <li>
                    Look Back
                    <ul>
                      <li>
                        CQL function: <code>C3F.ImmunizationLookBack</code>
                      </li>
                      <li>
                        Summary: Returns a list of immunizations that occurred between now and the time period specified by the
                        user
                        <ul>
                          <li>
                            In FHIR R4, this returns immunizations with <code>occurrence[x]</code> that occurred within the period
                          </li>
                          <li>
                            In FHIR STU3 and DSTU2, this returns immunizations with <code>date</code> that occurred within the
                            {' '}period
                          </li>
                        </ul>
                      </li>
                      <li>
                        Returns: List of Immunizations
                      </li>
                    </ul>
                  </li>
                  <li>
                    Most Recent
                    <ul>
                      <li>
                        CQL function: <code>C3F.MostRecentProcedure</code>
                      </li>
                      <li>
                        Summary: Returns the most recent immunization from a list.
                        <ul>
                          <li>
                            In FHIR R4, this sorts immunizations by <code>occurrence[x]</code> datetimes and returns the last
                            {' '}immunization from that list.
                          </li>
                          <li>
                            In FHIR STU3 and DSTU2, this sorts immunizations by <code>date</code> values and returns the last
                            {' '}immunization from that list.
                          </li>
                        </ul>
                      </li>
                      <li>
                        Returns: Immunization
                      </li>
                    </ul>
                  </li>
                  <li>
                    See expressions that can be applied to <a href="#list-types">any list</a>
                  </li>
                </ul>

                <h3 id="list-of-integers">List of Integers</h3>

                <ul>
                  <li>See expressions that can be applied to <a href="#list-types">any list</a></li>
                </ul>

                <h3 id="list-of-medication-order">List of Medication Requests or Medication Orders</h3>

                <ul>
                  <li>
                    Active
                    <ul>
                      <li>
                        CQL function: <code>C3F.ActiveMedicationRequest</code> or <code>C3F.ActiveMedicationOrder</code>
                      </li>
                      <li>
                        Summary: Returns a list of medications that are active according to a prescription
                        <ul>
                          <li>
                            In FHIR R4 and STU3, this returns a list of medication requests with <code>status</code> 'active'
                          </li>
                          <li>
                            In FHIR DSTU2, this returns a list of medication orders with <code>status</code> 'active'
                            {' '}and <code>dateEnded</code> is 'null'
                          </li>
                        </ul>
                      </li>
                      <li>
                        Returns: List of Medication Requests or Medication Orders
                      </li>
                    </ul>
                  </li>
                  <li>
                    Look Back
                    <ul>
                      <li>
                        CQL function: <code>C3F.MedicationRequestLookBack</code> or <code>C3F.MedicationOrderLookBack</code>
                      </li>
                      <li>
                        Summary: Returns a list of medications that were written between now and the time period specified
                        by the user
                        <ul>
                          <li>
                            In FHIR R4 and STU3, this returns a list of medication requests with <code>authoredOn</code> that
                            {' '}occurred within the period
                          </li>
                          <li>
                            In FHIR DSTU2, this returns a list of medication orders with <code>dateWritten</code> or
                            {' '}<code>dateEnded</code> that occurred within the period
                          </li>
                        </ul>
                      </li>
                      <li>
                        Returns: List of Medication Requests or Medication Orders
                      </li>
                    </ul>
                  </li>
                  <li>
                    See expressions that can be applied to <a href="#list-types">any list</a>
                  </li>
                </ul>

                <h3 id="list-of-medication-statements">List of Medication Statements</h3>

                <ul>
                  <li>
                    Active
                    <ul>
                      <li>
                        CQL function: <code>C3F.ActiveMedicationStatement</code>
                      </li>
                      <li>
                        Summary: Returns a list of medication statements that are active according to a statement, but not
                        necessarily verified via a prescription
                        <ul>
                          <li>
                            In FHIR R4, this returns a list of medication statements where <code>status</code> is 'active'
                            and <code>end of EffectivePeriod</code> is 'null' or 'after Now()'
                          </li>
                          <li>
                            In FHIR STU3, this returns a list of medication statements where <code>status</code> is 'active'
                            and <code>taken</code> is 'y' and <code>end of EffectivePeriod</code> is 'null' or 'after Now()'
                          </li>
                          <li>
                            In FHIR DSTU2, this returns a list of medication statements where <code>status</code> is
                            'active', <code>wasNotTaken</code> is not true, and <code>end of EffectivePeriod</code> is
                            'null' or 'after Now()'
                          </li>
                        </ul>
                      </li>
                      <li>
                        Returns: List of Medication Statements
                      </li>
                    </ul>
                  </li>
                  <li>
                    Look Back
                    <ul>
                      <li>
                        CQL function: <code>C3F.MedicationStatementLookBack</code>
                      </li>
                      <li>
                        Summary: Returns a list of medication statements with <code>effective[x]</code> that occurred
                        between now and the time period specified by the user
                      </li>
                      <li>
                        Returns: List of Medication Statements
                      </li>
                    </ul>
                  </li>
                  <li>
                    See expressions that can be applied to <a href="#list-types">any list</a>
                  </li>
                </ul>

                <h3 id="list-of-observations">List of Observations</h3>

                <ul>
                  <li>Highest Observation Value
                    <ul>
                      <li>
                        CQL function: <code>C3F.HighestObservation</code>
                      </li>
                      <li>
                        Summary: Returns the highest observation from a list of observations
                        <ul>
                          <li>
                            In FHIR STU3, this returns the system quantity with the highest <code>value</code>
                          </li>
                          <li>
                            In FHIR DSTU2, this returns the system quantity with the highest <code>valueQuantity</code>
                          </li>
                        </ul>
                      </li>
                      <li>
                        Returns: System Quantity
                      </li>
                    </ul>
                  </li>
                  <li>
                    Look Back
                    <ul>
                      <li>
                        CQL function: <code>C3F.ObservationLookBack</code>
                      </li>
                      <li>
                        Summary: Returns a list of observations with <code>effective[x]</code> or <code>issued</code> time
                        between now and the time period specified by the user
                      </li>
                      <li>
                        Returns: List of Observations
                      </li>
                    </ul>
                  </li>
                  <li>
                    Most Recent
                    <ul>
                      <li>
                        CQL function: <code>C3F.MostRecent</code>
                      </li>
                      <li>
                        Summary: Returns the most recent observation from a list. Sorts observations by
                        {' '}<code>effective[x]</code> and <code>issued</code> times and returns the last observation
                        from that list.
                      </li>
                      <li>
                        Returns: Observation
                      </li>
                    </ul>
                  </li>
                  <li>
                    Verified
                    <ul>
                      <li>
                        CQL function: <code>C3F.Verified</code>
                      </li>
                      <li>
                        Summary: Returns a list of observations that are complete and verified
                        <ul>
                          <li>
                            In FHIR R4 and STU3, this returns observations with with <code>status</code> of 'final,' 'amended,' or
                            'corrected'
                          </li>
                          <li>
                            In FHIR DSTU2, this returns observations with with <code>status</code> of 'final' or 'amended'
                          </li>
                        </ul>
                      </li>
                      <li>
                        Returns: List of Observations
                      </li>
                    </ul>
                  </li>
                  <li>
                    With Unit:
                    <ul>
                      <li>
                        CQL function: <code>C3F.WithUnit</code>
                      </li>
                      <li>
                        Summary: Returns a list of observations with quantity values recorded in the unit specified by the user
                        <ul>
                          <li>
                            In FHIR R4 and STU3, returns observations with <code>value.unit</code> or <code>value.code</code>
                            {' '}equal to the unit specified by the user
                          </li>
                          <li>
                            In FHIR DSTU2, returns observations with <code>valueQuantity.unit</code> or
                            {' '}<code>valueQuantity.code</code> equal to the unit specified by the user
                          </li>
                        </ul>
                      </li>
                      <li>
                        Returns: List of Observations
                      </li>
                    </ul>
                  </li>
                  <li>
                    See expressions that can be applied to <a href="#list-types">any list</a>
                  </li>
                </ul>

                <h3 id="list-of-procedures">List of Procedures</h3>

                <ul>
                  <li>Completed
                    <ul>
                      <li>
                        CQL function: <code>C3F.Completed</code>
                      </li>
                      <li>
                        Summary: Returns a list of procedures that are completed
                        <ul>
                          <li>
                            In FHIR R4, this returns procedures with <code>status</code> of 'completed'
                          </li>
                          <li>
                            In FHIR STU3, this returns procedures with <code>status</code> of 'completed'
                            and <code>notDone</code> is 'not true'
                          </li>
                          <li>
                            In FHIR DSTU2, this returns procedures with <code>status</code> of 'completed'
                            and <code>notPerformed</code> is 'not true'
                          </li>
                        </ul>
                      </li>
                      <li>
                        Returns: List of Procedures
                      </li>
                    </ul>
                  </li>
                  <li>
                    In Progress
                    <ul>
                      <li>
                        CQL function: <code>C3F.ProcedureInProgress</code>
                      </li>
                      <li>
                        Summary: Returns a list of procedures that are in progress
                        <ul>
                          <li>
                            In FHIR R4, this returns procedures with <code>status</code> of 'in-progress'
                          </li>
                          <li>
                            In FHIR STU3, this returns procedures with <code>status</code> of 'in-progress'
                            and <code>notDone</code> is 'not true'
                          </li>
                          <li>
                            In FHIR DSTU2, this returns procedures with <code>status</code> of 'in-progress'
                            and <code>notPerformed</code> is 'not true'
                          </li>
                        </ul>
                      </li>
                      <li>
                        Returns: List of Procedures
                      </li>
                    </ul>
                  </li>
                  <li>
                    Look Back
                    <ul>
                      <li>
                        CQL function: <code>C3F.ProcedureLookBack</code>
                      </li>
                      <li>
                        Summary: Returns a list of procedures with <code>performed[x]</code> that occurred between now and
                        the time period specified by the user
                      </li>
                      <li>
                        Returns: List of Procedures
                      </li>
                    </ul>
                  </li>
                  <li>
                    Most Recent
                    <ul>
                      <li>
                        CQL function: <code>C3F.MostRecentProcedure</code>
                      </li>
                      <li>
                        Summary: Returns the most recent procedure from a list. Sorts procedures by <code>performed[x]</code>
                        times and returns the last procedure from that list.
                      </li>
                      <li>
                        Returns: Procedure
                      </li>
                    </ul>
                  </li>
                  <li>
                    See expressions that can be applied to <a href="#list-types">any list</a>
                  </li>
                </ul>

                <h3 id="list-of-strings">List of Strings</h3>

                <ul>
                  <li>See expressions that can be applied to <a href="#list-types">any list</a></li>
                </ul>

                <h3 id="list-of-system-codes">List of System Codes</h3>

                <ul>
                  <li>See expressions that can be applied to <a href="#list-types">any list</a></li>
                </ul>

                <h3 id="list-of-system-concepts">List of System Concepts</h3>

                <ul>
                  <li>See expressions that can be applied to <a href="#list-types">any list</a></li>
                </ul>

                <h3 id="list-of-system-quantities">List of System Quantities</h3>

                <ul>
                  <li>See expressions that can be applied to <a href="#list-types">any list</a></li>
                </ul>

                <h3 id="list-of-times">List of Times</h3>

                <ul>
                  <li>See expressions that can be applied to <a href="#list-types">any list</a></li>
                </ul>

                <h3 id="list-of-any">List of Any</h3>

                <ul>
                  <li>See expressions that can be applied to <a href="#list-types">any list</a></li>
                </ul>

                <h3 id="list-of-others">List of Others</h3>

                <ul>
                  <li>See expressions that can be applied to <a href="#list-types">any list</a></li>
                </ul>
              </div>
            </div>

            <div className="h2-wrapper">
              <h2 id="interval-types">Interval Types</h2>

              <div className="h3-wrapper">
                <p>The following expressions can be applied to any interval:</p>

                <ul>
                  <li>After
                    <ul>
                      <li>CQL operator: <code>after</code></li>
                      <li>Summary: Applies CQL operator <code>after</code> using the value specified by the user</li>
                      <li>Returns: Boolean</li>
                    </ul>
                  </li>
                  <li>
                    Before
                    <ul>
                      <li>CQL operator: <code>before</code></li>
                      <li>Summary: Applies CQL operator <code>before</code> using the value specified by the user</li>
                      <li>Returns: Boolean</li>
                    </ul>
                  </li>
                  <li>Contains
                    <ul>
                      <li>CQL operator: <code>contains</code></li>
                      <li>Summary: Applies CQL membership <code>contains</code> using the value specified by the user</li>
                      <li>Returns: Boolean</li>
                    </ul>
                  </li>
                  <li>
                    See expressions that can be applied to <a href="#any-type">any type</a>
                  </li>
                </ul>

                <h3 id="interval-of-integers">Interval of Integers</h3>

                <ul>
                  <li>
                    See expressions that can be applied to <a href="#interval-types">any interval</a>. User specifies an
                    integer for each input value of the expression.
                  </li>
                </ul>

                <h3 id="interval-of-datetime">Interval of Datetime</h3>

                <ul>
                  <li>
                    See expressions that can be applied to <a href="#interval-types">any interval</a>. User specifies a
                    datetime for each input value of the expression.
                  </li>
                </ul>

                <h3 id="interval-of-decimals">Interval of Decimals</h3>

                <ul>
                  <li>
                    See expressions that can be applied to <a href="#interval-types">any interval</a>. User specifies a
                    decimal for each input value of the expression.
                  </li>
                </ul>

                <h3 id="interval-of-quantities">Interval of Quantities</h3>

                <ul>
                  <li>
                    See expressions that can be applied to <a href="#interval-types">any interval</a>. User specifies a
                    quantity value and unit for each input value of the expression.
                  </li>
                </ul>
              </div>
            </div>

            <div className="h2-wrapper">
              <h2 id="other-types">Other Types</h2>

              <div className="h3-wrapper">
                <h3 id="allergy-intolerance">Allergy Intolerance</h3>

                <ul>
                  <li>See expressions that can be applied to <a href="#any-type">any type</a></li>
                </ul>

                <h3 id="boolean">Boolean</h3>

                <ul>
                  <li>Is (Not) True/False?
                    <ul>
                      <li
                        >CQL operator: <code>is true</code>, <code>is not true</code>, <code>is false</code>, or
                        {' '}<code>is not false</code>
                      </li>
                      <li>
                        Summary: Checks if the current element is or is not <code>true</code> or <code>false</code>.
                      </li>
                      <li>Returns: Boolean</li>
                    </ul>
                  </li>
                  <li>
                    Not
                    <ul>
                      <li>CQL operator: <code>not</code></li>
                      <li>
                        Summary: Negates the value of the current element. If the current value is <code>true</code>,
                        this will return <code>false</code>. If the current value is <code>false</code>, this will return
                        {' '}<code>true</code>.
                      </li>
                      <li>Returns: Boolean</li>
                    </ul>
                  </li>
                  <li>
                    See expressions that can be applied to <a href="#any-type">any type</a>
                  </li>
                </ul>

                <h3 id="condition">Condition</h3>

                <ul>
                  <li>See expressions that can be applied to <a href="#any-type">any type</a></li>
                </ul>

                <h3 id="datetime">Datetime</h3>

                <ul>
                  <li>
                    After
                    <ul>
                      <li>CQL operator: <code>after</code></li>
                      <li>Summary: Checks if the current datetime is after the datetime specified by the user</li>
                      <li>Returns: Boolean</li>
                    </ul>
                  </li>
                  <li>
                    Before
                    <ul>
                      <li>CQL operator: <code>before</code></li>
                      <li>Summary: Checks if the current datetime is before the datetime specified by the user</li>
                      <li>Returns: Boolean</li>
                    </ul>
                  </li>
                  <li>See expressions that can be applied to <a href="#any-type">any type</a></li>
                </ul>

                <h3 id="decimal">Decimal</h3>

                <ul>
                  <li>
                    Value Comparison
                    <ul>
                      <li>
                        CQL operator: comparison operators <code>{'='}</code>, <code>{'!='}</code>, <code>{'>'}</code>,
                        {' '}<code>{'>='}</code>, <code>{'<'}</code>, or <code>{'<='}</code>
                      </li>
                      <li>
                        Summary: Compares the current decimal using the operator(s) and value(s) specified by the user. Users can
                        choose one or two operators and values to create a one or two sided comparison.
                      </li>
                      <li>Returns: Boolean</li>
                    </ul>
                  </li>
                  <li>See expressions that can be applied to <a href="#any-type">any type</a></li>
                </ul>

                <h3 id="device">Device</h3>

                <ul>
                  <li>See expressions that can be applied to <a href="#any-type">any type</a></li>
                </ul>

                <h3 id="encounter">Encounter</h3>

                <ul>
                  <li>See expressions that can be applied to <a href="#any-type">any type</a></li>
                </ul>

                <h3 id="immunization">Immunization</h3>

                <ul>
                  <li>See expressions that can be applied to <a href="#any-type">any type</a></li>
                </ul>

                <h3 id="integer">Integer</h3>

                <ul>
                  <li>
                    Value Comparison
                    <ul>
                      <li>
                        CQL operator: comparison operators <code>{'='}</code>, <code>{'!='}</code>, <code>{'>'}</code>,
                        {' '}<code>{'>='}</code>, <code>{'<'}</code>, or <code>{'<='}</code>
                      </li>
                      <li>
                        Summary: Compares the current integer using the operator(s) and value(s) specified by the user. Users can
                        choose one or two operators and values to create a one or two sided comparison.
                      </li>
                      <li>Returns: Boolean</li>
                    </ul>
                  </li>
                  <li>See expressions that can be applied to <a href="#any-type">any type</a></li>
                </ul>

                <h3 id="medication-order">Medication Order</h3>

                <ul>
                  <li>See expressions that can be applied to <a href="#any-type">any type</a></li>
                </ul>

                <h3 id="medication-statement">Medication Statement</h3>

                <ul>
                  <li>See expressions that can be applied to <a href="#any-type">any type</a></li>
                </ul>

                <h3 id="observation">Observation</h3>

                <ul>
                  <li>
                    Quantity Value
                    <ul>
                      <li>
                        CQL function: <code>C3F.QuantityValue</code>
                      </li>
                      <li>
                        Summary: Returns an observation value as a CQL Quantity
                        <ul>
                          <li>In FHIR R4 and STU3, this returns the 'value' and 'unit' of an observation <code>value</code></li>
                          <li>In FHIR DSTU2, this returns the 'value' and 'unit' of an observation <code>valueQuantity</code></li>
                        </ul>
                      </li>
                      <li>
                        Returns: System Quantity
                      </li>
                    </ul>
                  </li>
                  <li>
                    Concept Value
                    <ul>
                      <li>
                        CQL function: <code>C3F.ConceptValue</code>
                      </li>
                      <li>
                        Summary: Returns an observation value as a CQL Concept
                        <ul>
                          <li>
                            In FHIR R4 and STU3, this returns the 'codes' and 'display' of an observation <code>value</code>
                          </li>
                          <li>
                            In FHIR DSTU2, this returns the 'codes' and 'display' of an
                            observation <code>valueCodeableConcept</code>
                          </li>
                        </ul>
                      </li>
                      <li>
                        Returns: System Concept
                      </li>
                    </ul>
                  </li>
                  <li>
                    See expressions that can be applied to <a href="#any-type">any type</a>
                  </li>
                </ul>

                <h3 id="procedure">Procedure</h3>

                <ul>
                  <li>See expressions that can be applied to <a href="#any-type">any type</a></li>
                </ul>

                <h3 id="string">String</h3>

                <ul>
                  <li>
                    Ends With
                    <ul>
                      <li>
                        CQL operator: <code>EndsWith</code>
                      </li>
                      <li>
                        Summary: Checks if the current string ends with the string value specified by the user
                      </li>
                      <li>
                        Returns: Boolean
                      </li>
                    </ul>
                  </li>
                  <li>
                    Equals
                    <ul>
                      <li>
                        CQL operator: Equality <code>=</code>
                      </li>
                      <li>
                        Summary: Checks if the current string is equal to the string value specified by the user
                        using <code>=</code>
                      </li>
                      <li>
                        Returns: Boolean
                      </li>
                    </ul>
                  </li>
                  <li>
                    Starts With
                    <ul>
                      <li>
                        CQL operator: <code>StartsWith</code>
                      </li>
                      <li>
                        Summary: Checks if the current string starts with the string specified by the user
                      </li>
                      <li>
                        Returns: Boolean
                      </li>
                    </ul>
                  </li>
                  <li>
                    See expressions that can be applied to <a href="#any-type">any type</a>
                  </li>
                </ul>

                <h3 id="system-code">System Code</h3>

                <ul>
                  <li>
                    Qualifier
                    <ul>
                      <li>
                        CQL operator: CQL membership <code>in</code> or CQL equivalence <code>~</code>
                      </li>
                      <li>
                        Summary: Choosing "value is a code from" checks if the current System Code is included
                        in a valueset specified by the user. Choosing "value is the code"
                        checks if the current System Code is the same as the code specified by the user.
                      </li>
                      <li>
                        Returns: Boolean
                      </li>
                    </ul>
                  </li>
                  <li>
                    See expressions that can be applied to <a href="#any-type">any type</a>
                  </li>
                </ul>

                <h3 id="system-concept">System Concept</h3>

                <ul>
                  <li>
                    Qualifier
                    <ul>
                      <li>
                        CQL operator: CQL membership <code>in</code> or CQL equivalence <code>~</code>
                      </li>
                      <li>
                        Summary: Choosing "value is a code from" checks if the current System Concept is included
                        in a valueset specified by the user. Choosing "value is the code"
                        checks if the current System Concept is the same as the code specified by the user.
                      </li>
                      <li>
                        Returns: Boolean
                      </li>
                    </ul>
                  </li>
                  <li>
                    See expressions that can be applied to <a href="#any-type">any type</a>
                  </li>
                </ul>

                <h3 id="system-quantity">System Quantity</h3>

                <ul>
                  <li>
                    Convert Units
                    <ul>
                      <li>
                        CQL function: <code>Convert.to_mg_per_dL</code> or other available function chosen by the user
                      </li>
                      <li>
                        Summary: Applies the chosen conversion function to the current element
                        <ul>
                          <li>
                            <code>Convert.to_mg_per_dL</code> converts the System Quantity value from mmol/L to mg/dL
                            for blood cholesterol and returns the converted quantity
                          </li>
                        </ul>
                      </li>
                      <li>
                        Returns: System Quantity
                      </li>
                    </ul>
                  </li>
                  <li>
                    Value Comparison
                    <ul>
                      <li>
                        CQL operator: comparison operators <code>{'='}</code>, <code>{'!='}</code>, <code>{'>'}</code>,
                        {' '}<code>{'>='}</code>, <code>{'<'}</code>, or <code>{'<='}</code>
                      </li>
                      <li>
                        Summary: Compares the current quantity using the operator(s), value(s), and unit specified by the user.
                        Users can choose one or two operators and values to create a one or two sided comparison.
                      </li>
                      <li>Returns: Boolean</li>
                    </ul>
                  </li>
                  <li>
                    See expressions that can be applied to <a href="#any-type">any type</a>
                  </li>
                </ul>

                <h3 id="time">Time</h3>

                <ul>
                  <li>
                    After
                    <ul>
                      <li>CQL operator: <code>after</code></li>
                      <li>Summary: Checks if the current element is after the time specified by the user</li>
                      <li>Returns: Boolean</li>
                    </ul>
                  </li>
                  <li>
                    Before
                    <ul>
                      <li>CQL operator: <code>before</code></li>
                      <li>Summary: Checks if the current element is before the time specified by the user</li>
                      <li>Returns: Boolean</li>
                    </ul>
                  </li>
                  <li>
                    See expressions that can be applied to <a href="#any-type">any type</a>
                  </li>
                </ul>

                <h3 id="any">Any</h3>

                <ul>
                  <li>See expressions that can be applied to <a href="#any-type">any type</a></li>
                </ul>

                <h3 id="other">Other</h3>

                <ul>
                  <li>See expressions that can be applied to <a href="#any-type">any type</a></li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}
