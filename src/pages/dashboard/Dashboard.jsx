import React from 'react'
import Titlebar from '../../comnponents/titlebar/Titlebar'


const Dashboard = () => {
  return (
    <div style={{height:'93vh'}}>
      <Titlebar title={"Dashboard"} filter={false} />
    </div>
  )
}

export default Dashboard