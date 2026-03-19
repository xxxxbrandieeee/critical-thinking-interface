import React, { useContext } from 'react'
import './Page_scenario.css'
import { Button } from 'antd'
import PageContext from '../PageContext.js';
import allInfo from '../data.js'
import CountButton from './Countbtn.js';
import { getCurrentConfig } from '../config/projectConfig.js';
const countdownTime=2

const config = getCurrentConfig();

allInfo['Page_scenario']={}
export default function Page_scenario() {
    const { setCurrentPage,currentPage } = useContext(PageContext);

    const next = () => {
        allInfo['Page_scenario']['time'] = + new Date()
        setCurrentPage(currentPage+1)
    }
    return (
        <>
            <div className='Page_scenario_content'>
                <div className='instruction'>
                    <span className='highlight'>[Instruction] Imagine you are a city council member in Bryn Bower.</span> You need to make a recommendation on whether the city should accept or reject the proposal of Hallman, as described in the following scenario. <span className='highlight'>After reading the scenario,</span> on the next page, you will <span className='highlight'>have access to more documents that are potentially relevant to the task, and write about your reasoning and decision.</span> You can see this scenario again on the next page.
                </div>
                <div className='Page_scenario_text_content'>
                    <h2>Scenario and Task</h2>
                    <div className='Page_scenario_text'>
                        <p className='Page_scenario_item'>Bryn Bower is an affluent city in the Midwest with a population of 120,000. Due to its exceptional scientific infrastructure, Bryn Bower attracted companies that produce specialized engineering products. Hallman Inc. produces high-pressure pumps for nuclear power plants on the east side of town. Until 1979, Hallman legally stored wastewater on its premises in large shallow ponds (lagoons) so that the sunlight could break down its main contaminant, Exafluoran®, a chemical solvent used in many industrial processes. Hallman discontinued its use in 1980.</p>
                        <br />
                        <p className='Page_scenario_item'>In 1984, Exafluoran was detected in critical concentration in a well that was supposed to supply drinking water for Bryn Hill, a new subdivision. An official investigation revealed that one of the old lagoons had leaked into the ground and Exafluoran had reached the water table in high concentration around the factory, gradually spreading underground and contaminating the ground water (the contaminated area is called “the plume”). </p>
                        <br />
                        <p className='Page_scenario_item'>The US Environmental Protection Agency (EPA) classified Exafluoran as a “probable human carcinogen” and lowered the legal limit for drinking water to 20 parts per billion (ppb) in 2001. The drinking water supply for most Bryn Bower residents is not affected by the plume because they are on municipal water that comes from two reservoirs on the other side of town, but currently about 700 homes around the city still depend on private water wells that are – or potentially will be – contaminated. Legally, the city is obligated to connect homes to the city water if the well water tests above 20 ppb. Over the last 30 years, the city had to connect several hundred homes to municipal water for that reason. Despite a $25 Million clean-up effort by Hallman over the same period, the city filed several lawsuits to enforce more aggressive remediation measures and for reimbursement of the enforced expansion of the city water system. </p>
                        <br />
                        <p className='Page_scenario_item'>
                            <span className='highlight'>Two months ago, Hallman surprised the city with a simple proposal: </span>The company will make a one-time payment of $15 Million so that the city can immediately connect all homes with a well contamination of 3-20 ppb (status 2020) to municipal water, approximately 400 houses. In return, the city drops all pending lawsuits and takes over all of Hallman’s current and future liabilities related to the Exafluoran contamination outside the Hallman property line which roughly follows the 50ppb contamination line. After the city’s in-house counsel confirmed the legal feasibility of such a proposition, the mayor negotiated and was able to raise Hallman’s commitment to a final offer of $19 Million. After a very controversial public townhall meeting last week, he called an extraordinary city council meeting for a final vote.
                        </p>
                        <br />
                        <p className='Page_scenario_item'>
                            <span className='highlight'>You are a member of the city council</span> and the council meeting is in <span className='highlight'><span style={{color: 'red'}}>{config.Page_scenario.time} minutes</span></span>. Every council member is expected to deliver a ten-minute statement of prepared remarks as a chance to explain their deliberative process of their decision. Please prepare <span className='highlight'>an essay that describes your reasoning for your decision in 1~3 paragraphs, outlining your thoughts, weighing the pros and cons, and explaining your final decision.</span> Your argument should be based on the <span className='highlight'>exclusively</span> on information drawn from <span className='highlight'>some or all</span> the following documents you can read in the next page:
                        </p>
                        <br />
                        <ul className="custom_indent">
                            <li> Map of Bryn Bower indicating the contaminated areas</li>
                            <li> A leaked confidential Hallman document that estimates cleanup costs</li>
                            <li> A newspaper article describing the tumultuous townhall meeting</li>
                            <li> Pamphlet of the Clean Bryn Bower Initiative (CBBI)</li>
                            <li> EPA brochure on the toxicity of Exafluoran</li>
                            <li> Interview with David Hallman Sr., founder of Hallman Inc., on his 90th birthday</li>
                            <li> Resolution of the Southern Illinois Chapter of the Chemical Workers Union (CWU).</li>
                        </ul>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br /> 
                    </div>
                </div>
            </div>
            <CountButton countdownTime={countdownTime} onAction={next}/>
        </>

    )
}

