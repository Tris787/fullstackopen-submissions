const Course = ({course}) => {
  console.log('Course props:', course)
  return (
    <div>
      <Header course={course.name}/>
      <Content parts={course.parts}/> 
      <Total parts={course.parts}/>    
    </div>
  )
}

const Header = (props) => {
  console.log('Header props:', props)
  return (
    <div>
      <h1>{props.course}</h1>
    </div>
  )
}

const Content = ({parts}) => {
  console.log('Content props:', parts)
  return (
    <div>
      {parts.map(part => 
        <Part key={part.id} part={part.name} exercises={part.exercises}/>
      )}      
    </div>
  )
}

const Total = ({parts}) => {
  console.log('Total props:', parts)
  return (
    <p>
      <strong>total of {parts.reduce((sum, part) => sum + part.exercises, 0)} exercises</strong>
    </p>
  )  
}

const Part = (props) => {
  console.log('Part props:', props)
  return (
    <p>{props.part} {props.exercises}</p>
  )
}

export default Course
