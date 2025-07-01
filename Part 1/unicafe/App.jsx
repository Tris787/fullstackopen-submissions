import { use, useState } from 'react'

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const StatisticLine = ({statistic}) => {
  return (    
      <tr>
        <td>
          {statistic.label}
        </td>
        <td>
          {Math.round(statistic.statistic*10)/10} {statistic.percent}
        </td>
      </tr>    
  )  
}

const Statistics = ({good, neutral, bad}) => {  

  const allVotes = () => good + neutral + bad;

  const averageVote = () => { let average = (good * 1 + bad * -1) / (good + neutral + bad);                              
                              return Number.isNaN(average) ? 0 : average;}

  const positiveVotes = () => { let positive = good / (good + neutral + bad) * 100; 
                                return Number.isNaN(positive) ? 0 : positive;}
  
  return(
    <tbody>
      <StatisticLine statistic={{ label: 'good', statistic: good}}/>
      <StatisticLine statistic={{ label: 'neutral', statistic: neutral}}/>
      <StatisticLine statistic={{ label: 'bad', statistic: bad}}/>
      <StatisticLine statistic={{ label: 'all', statistic: allVotes()}}/>
      <StatisticLine statistic={{ label: 'average', statistic: averageVote()}}/>
      <StatisticLine statistic={{ label: 'positive', statistic: positiveVotes(), percent : '%'}}/>
    </tbody>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const setGoodEH = () => setGood(good +1);
  const setNeutralEH = () => setNeutral(neutral +1);
  const setBadEH = () => setBad(bad + 1);

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={setGoodEH} text='good'/>
      <Button onClick={setNeutralEH} text='neutral'/>
      <Button onClick={setBadEH} text='bad'/>
      
      <h1>statistics</h1>  
        
      {good + neutral + bad === 0 ? (    
        <p>
          No feedback given
        </p>      
       ) : (      
        <table>
          <Statistics good={good} neutral={neutral} bad={bad}/>
        </table>
      ) }  
    </div>
  )
}

export default App
