const Header = (props) => {
  console.log('Header props:', props)
  return (
    <div>
      <h1>{props.course}</h1>
    </div>
  )
}

const Content = (props) => {
  console.log('Content props:', props)
  return (
    <div>
      <Part part={props.parts[0].name} exercises={props.parts[0].exercises}/>
      <Part part={props.parts[1].name} exercises={props.parts[1].exercises}/>
      <Part part={props.parts[2].name} exercises={props.parts[2].exercises}/>
    </div>
  )
}

const Total = (props) => {
  console.log('Total props:', props)
  return (
    <p>Number of exercises {props.total}</p>
  )  
}

const Part = (props) => {
  console.log('Part props:', props)
  return (
    <p>{props.part} {props.exercises}</p>
  )
}

const App = () => {
  const course = { 
    name: 'Half Stack application development',
    parts : [
      {
        name: 'Fundamentals of React',
        exercises: 10
      }, 
      {
        name: 'Using props to pass data',
        exercises: 7
      }, 
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name}/>
      <Content parts={course.parts}/>
      <Total total={course.parts[0].exercises + course.parts[1].exercises + course.parts[2].exercises}/>      
    </div>
  )
}

export default App