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
              Note: <code>C3F</code> refers to the CDS Connect Commons library. The appropriate version for the FHIR
              version of an artifact will be selected and included in the artifact download.
            </p>

            <p>
              Note: <code>Convert</code> refers to the CDS Connect Conversions library, which will be included in the
              artifact download.
            </p>

            <div className="h2-wrapper">
              <h2 id="any-type">Any Type</h2>

              <div className="h3-wrapper">
                <p>The following expressions can be applied to every data type:</p>
                <li>Is (Not) Null?
                    <ul>
                    <li>CQL function: CQL null test <code>is [not] null</code></li>
                    <li>Summary: Checks if the current element <code>is [not] null</code></li>
                    <li>Returns: Boolean</li>
                  </ul>
                </li>
              </div>
            </div>

            <div className="h2-wrapper">
              <h2 id="list-types">List Types</h2>

              <div className="h3-wrapper">
                <p>All lists can use the following expressions:</p>

                <ul>
                  <li>
                    Count
                    <ul>
                      <li>CQL function: CQL function <code>Count</code></li>
                      <li>Summary: Applies <code>Count</code> to current element</li>
                      <li>Returns: Integer</li>
                    </ul>
                  </li>
                  <li>
                    Exists
                    <ul>
                      <li>CQL function: CQL function <code>exists</code></li>
                      <li>Summary: Applies <code>exists</code> to current element</li>
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
                            In FHIR STU3, this returns allergy intolerances with <code>clinicalStatus</code> 'active'
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
                      <li>CQL function: CQL function <code>AllTrue</code></li>
                      <li>Summary: Applies <code>AllTrue</code> to current element</li>
                      <li>Returns: Boolean</li>
                    </ul>
                  </li>
                  <li>
                    Any True
                    <ul>
                      <li>CQL function: CQL function <code>AnyTrue</code></li>
                      <li>Summary: Applies <code>AnyTrue</code> to current element</li>
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
                        Summary: Returns a list of conditions with <code>clinicalStatus</code> 'active'
                        and <code>abatement[x]</code> is 'null' or 'not true'
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
                      <li>Summary: Returns a list of conditions with <code>clinicalStatus</code> 'active' or 'relapse'</li>
                      <li>Returns: List of Conditions</li>
                    </ul>
                  </li>
                  <li>
                    Confirmed
                    <ul>
                      <li>CQL function: <code>C3F.Confirmed</code></li>
                      <li>Summary: Returns a list of conditions with <code>verificationStatus</code> 'confirmed'</li>
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

                <h3 id="list-of-integers">List of Integers</h3>

                <ul>
                  <li>See expressions that can be applied to <a href="#list-types">any list</a></li>
                </ul>

                <h3 id="list-of-medication-order">List of Medication Order</h3>

                <ul>
                  <li>
                    Active
                    <ul>
                      <li>
                        CQL function: <code>C3F.ActiveMedicationOrder</code>
                      </li>
                      <li>
                        Summary: Returns a list of medications that are active according to a prescription
                        <ul>
                          <li>
                            In FHIR STU3, this returns a list of medication requests with <code>status</code> 'active'
                          </li>
                          <li>
                            In FHIR DSTU2, this returns a list of medication orders with <code>status</code> 'active'
                            and <code>dateEnded</code> is 'null'
                          </li>
                        </ul>
                      </li>
                      <li>
                        Returns: List of Medication Orders
                      </li>
                    </ul>
                  </li>
                  <li>
                    Look Back
                    <ul>
                      <li>
                        CQL function: <code>C3F.MedicationOrderLookBack</code>
                      </li>
                      <li>
                        Summary: Returns a list of medications that are issued between now and the time period specified
                        by the user
                        <ul>
                          <li>
                            In FHIR STU3, this returns a list of medication requests with <code>authoredOn</code> that
                            occurred within the period
                          </li>
                          <li>
                            In FHIR DSTU2, this returns a list of medication orders with <code>dateWritten</code> or
                            {' '}<code>dateEnded</code> that occurred within the period
                          </li>
                        </ul>
                      </li>
                      <li>
                        Returns: List of Medication Orders
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
                            In FHIR STU3, this returns observations with with <code>status</code> of 'final,' 'amended,' or
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
                            In FHIR STU3, returns observations with <code>value.unit</code> or <code>value.code</code> equal
                            to the unit specified by the user
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
                            In FHIR STU3, this returns procedures with <code>status</code> of 'completed'
                            and <code>notDone</code> is 'not true'
                          </li>
                          <li>
                            In FHIR STU3, this returns procedures with <code>status</code> of 'completed'
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
                            In FHIR STU3, this returns procedures with <code>status</code> of 'in-progress'
                            and <code>notDone</code> is 'not true'
                          </li>
                          <li>
                            In FHIR STU3, this returns procedures with <code>status</code> of 'in-progress'
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
                <p>All lists can use the following expressions:</p>

                <ul>
                  <li>After
                    <ul>
                      <li
                        >CQL function: CQL timing phrase <code>after</code>
                      </li>
                      <li>
                        Summary: Applies CQL phrase <code>after</code> using the value specified by the user.
                      </li>
                      <li>
                        Returns: Boolean
                      </li>
                    </ul>
                  </li>
                  <li>
                    Before
                    <ul>
                      <li>CQL function: CQL timing phrase <code>before</code></li>
                      <li>Summary: Applies CQL phrase <code>before</code> using the value specified by the user.</li>
                      <li>Returns: Boolean</li>
                    </ul>
                  </li>
                  <li>Contains
                    <ul>
                      <li>CQL function: CQL membership <code>contains</code></li>
                      <li>Summary: Applies CQL membership <code>contains</code> using the value specified by the user.</li>
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
                      <li>CQL function: CQL boolean test operators <code>is [not] true</code> and <code>is [not] false</code></li>
                      <li>Summary: Checks if the current element <code>is [not] true</code> or <code>is [not] false</code></li>
                      <li>Returns: Boolean</li>
                    </ul>
                  </li>
                  <li>
                    Not
                    <ul>
                      <li>CQL function: CQL function <code>not</code></li>
                      <li>Summary: Applies <code>not</code> to the current element</li>
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
                      <li>CQL function: CQL timing phrase <code>after</code></li>
                      <li>Summary: Applies CQL phrase <code>after</code> using the time specified by the user</li>
                      <li>Returns: Boolean</li>
                    </ul>
                  </li>
                  <li>
                    Before
                    <ul>
                      <li>CQL function: CQL timing phrase <code>before</code></li>
                      <li>Summary: Applies CQL phrase <code>before</code> using the time specified by the user</li>
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
                      <li>CQL function: CQL comparison operators</li>
                      <li>Summary: Applies the comparison operator(s) and value(s) specified by the user</li>
                      <li>Returns: Boolean</li>
                    </ul>
                  </li>
                  <li>See expressions that can be applied to <a href="#any-type">any type</a></li>
                </ul>

                <h3 id="encounter">Encounter</h3>

                <ul>
                  <li>See expressions that can be applied to <a href="#any-type">any type</a></li>
                </ul>

                <h3 id="integer">Integer</h3>

                <ul>
                  <li>
                    Value Comparison
                    <ul>
                      <li>CQL function: CQL comparison operators</li>
                      <li>Summary: Applies the comparison operator(s) and value(s) specified by the user</li>
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
                          <li>In FHIR STU3, this returns the 'value' and 'unit' of an observation <code>value</code></li>
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
                            In FHIR STU3, this returns the 'codes' and 'display' of an observation <code>value</code>
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
                        CQL function: CQL <code>EndsWith</code>
                      </li>
                      <li>
                        Summary: Applies <code>EndsWith</code> function to the current element with the value specified
                        by the user
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
                        CQL function: CQL equality <code>=</code>
                      </li>
                      <li>
                        Summary: Checks equality between the current element and the value specified by the user
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
                        CQL function: CQL <code>StartsWith</code>
                      </li>
                      <li>
                        Summary: Applies <code>StartsWith</code> function to the current element with the value specified
                        by the user
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
                        CQL function: CQL equality <code>~</code> or CQL membership <code>in</code>
                      </li>
                      <li>
                        Summary: Choosing "value is a code from" checks the current System Code for inclusion in a
                        valueset specified by the user using <code>in</code>. Choosing "value is the code from"
                        checks the current System Code for equality to a code specified by the user using <code>~</code>.
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
                        CQL function: CQL equality <code>~</code> or CQL membership <code>in</code>
                      </li>
                      <li>
                        Summary: Choosing "value is a code from" checks the current System Concept for inclusion
                        in a valueset specified by the user using <code>in</code>. Choosing "value is the code from"
                        checks the current System Concept for equality to a code specified by the user using <code>~</code>.
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
                        Summary: Applies the chosen function to the current element
                        <ul>
                          <li>
                            <code>Convert.to_mg_per_dL</code> converts the System Quantity value from mmol/L to mg/dL and
                            returns the converted quantity
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
                      <li>CQL function: CQL comparison operators</li>
                      <li>Summary: Applies the comparison operator(s), value(s), and unit specified by the user</li>
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
                      <li>CQL function: CQL timing phrase <code>after</code></li>
                      <li>Summary: Applies CQL phrase <code>after</code> using the time specified by the user</li>
                      <li>Returns: Boolean</li>
                    </ul>
                  </li>
                  <li>
                    Before
                    <ul>
                      <li>CQL function: CQL timing phrase <code>before</code></li>
                      <li>Summary: Applies CQL phrase <code>before</code> using the time specified by the user</li>
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
