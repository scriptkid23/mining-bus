import React, { Component } from 'react'

import Axios from 'axios'
import {Modal,Button,InputGroup,FormControl} from 'react-bootstrap'
import './App.css';
import Logo from './add-button.svg'


const convertStationToID = async (station) => {
  let formData = new FormData();
  formData.append('act','searchfull');
  formData.append('typ','2');
  formData.append('key',station)
  return await Axios({
    method:"POST",
    url:"/Engine/Business/Search/action.ashx",
    headers:{
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
    },
    data:formData
  })
}
const getVehicle = (fleetCode, stationID) =>{
    let formData = new FormData();
    formData.append('act','partremained');
    formData.append('State','true');
    formData.append('StationID',stationID);
    formData.append('FleetOver',fleetCode);
    
    return Axios({
      method:"POST",
      url:"/Engine/Business/Vehicle/action.ashx",
      headers:{
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
    },
    data:formData,
    })

}
const getBusInformation = async () => {

  let formData = new FormData();
  formData.append("act", "searchfull");
  formData.append("typ", "1");
  formData.append("key","");
  return Axios({
    method:"POST",
    url:"/Engine/Business/Search/action.ashx",
    headers:{
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
  },
  data:formData,
  })
}
const getListBreakpointOfBus = async (fid) => {
  let formData = new FormData();
  formData.append('act','fleetdetail');
  formData.append('fid',fid);
  return await Axios({
    method:"POST",
    url:"/Engine/Business/Search/action.ashx",
    headers:{
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
  },
  data:formData,
  })
}

const BusComponent = ({fleetCode, code, partRemained, timeRemained, station}) => {
      const convertPartRemained = (value) =>{
        if(value >= 1000){
          return Math.round(value/1000 * 100) / 100 + ' km'
        }
        else{
          return value + " m"
        }
      }
      return(
        <div className="bus-component">
          <h1>{code} - {fleetCode}</h1>
          <p>{convertPartRemained(partRemained)}</p>
          <p>{timeRemained}</p>
          <p>{station}</p>
        </div>
      )
}
const AddBusChecking =  (props) => {
  const [show, setShow] = React.useState(false);
  const [address, set_address] = React.useState(null);
  const [fleetCode, set_fleet_code] = React.useState(null);

  var result = [];

  const handleClose = () => setShow(false);
  const handleStart = async () => {
    let {data} = await convertStationToID(address)
    let currentObjectID = data['dt']['Data'][0]['ObjectID']
    let busInformation = await getBusInformation();
    console.log(busInformation)
    var listBreakpointOfBus = await getListBreakpointOfBus(fleetCode);
    console.log(listBreakpointOfBus)
    result.push({fleetCode:fleetCode, stationID:currentObjectID.toString()})
    let go = listBreakpointOfBus.data.dt.Go.Station.filter((value) => value['Code'] == currentObjectID)
    if(go.length != 0){
      let currrentIndex = listBreakpointOfBus.data.dt.Go.Station.indexOf(go[0]);
      result.push({fleetCode:fleetCode, stationID:listBreakpointOfBus.data.dt.Go.Station[currrentIndex -1].Code})
    }
    else{
      let re = listBreakpointOfBus.data.dt.Re.Station.filter((value) => value['Code'] == currentObjectID)
      if(re.length != 0){
        let currrentIndex = listBreakpointOfBus.data.dt.Re.Station.indexOf(re[0]);
        result.push({fleetCode:fleetCode, stationID:listBreakpointOfBus.data.dt.Re.Station[currrentIndex -1].Code})
      }
    }
    // console.log(result.reverse())
    props.setValue({type:"SET_VALUE",value:result.reverse()})
    setShow(false);
    
  };
  const handleShow = () => setShow(true);

  return(
    <>
    <div onClick={handleShow}>
      <img src={Logo} alt="Add" width={50} height={50}/>
    </div>
    

    <Modal show={show} centered onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Tracing</Modal.Title>
      </Modal.Header>
      <Modal.Body>
          <InputGroup className="mb-3">
            <FormControl
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              placeholder="Địa chỉ"
              value = {address}
              onChange = {(e) => set_address(e.target.value)}
            />
           
          </InputGroup>
          <InputGroup className="mb-3">
            <FormControl
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              placeholder="Mã xe"
              value = {fleetCode}
              onChange = {(e) => set_fleet_code(e.target.value)}
            />
          </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleStart}>
          Start
        </Button>
      </Modal.Footer>
    </Modal>
  </>
  )
}
function App() {
  const reducer = (state,action) => {
    switch(action.type){
      case 'SET_VALUE':
        console.log(...state.data)
        return {
          data : [...state.data, action.value]
        };
      default:
        return new Error();
    }
  }
  const [list_bus,dispatch] = React.useReducer(reducer,{data:[]});
  React.useEffect(() => {
    Axios.all([getVehicle("107","2024")]).then(
      Axios.spread((...res) => {
        console.log(res)
      })
    )
  },[])
  
  return (
    <div className="App">
        {/* <div ref={(ref) => refMap = ref} 
        style={{width:"100%",height:"100vh"}}/> */}
        <div className="list-bus">
            <BusComponent/>
            <BusComponent/>     
            <BusComponent/>
            <BusComponent/>
            <BusComponent/>
            <BusComponent/>      
            
            </div>
        
        <div className="Logo">
          <AddBusChecking setValue = {(payload) => dispatch(payload)}/>
          
        </div>
        <Button onClick={() => console.log(list_bus)}>CLick me</Button>
    </div>

  );
}

export default App;
