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
        const toHHMMSS = function (value) {
          var sec_num = parseInt(value, 10); // don't forget the second param
          var hours   = Math.floor(sec_num / 3600);
          var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
          var seconds = sec_num - (hours * 3600) - (minutes * 60);

          if (hours   < 10) {hours   = "0"+hours;}
          if (minutes < 10) {minutes = "0"+minutes;}
          if (seconds < 10) {seconds = "0"+seconds;}
          return hours + ':' + minutes + ':' + seconds;
      }
      const convertPartRemained = (value) =>{
        if(value >= 1000){
          return Math.round(value/1000 * 100) / 100 + ' km'
        }
        else{
          return value + " m"
        }
      }
      return(
        <div className="bus-component d-flex flex-column justify-content-center">
          <h1>{code} - {fleetCode}</h1>
          <p>{convertPartRemained(partRemained)}</p>
          <p>{toHHMMSS(timeRemained)}</p>
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
    let ObjectID = busInformation.data.dt.Data.filter(value => value['FleedCode'] == fleetCode)[0].ObjectID
    var listBreakpointOfBus = await getListBreakpointOfBus(ObjectID);
    
   
    let go = listBreakpointOfBus.data.dt.Go.Station.filter((value) => value['Code'] == currentObjectID)

    if(go.length != 0){
      result.push({
        fleetCode:fleetCode, 
        stationID:currentObjectID.toString(),
        station:go[0].Name})

      let currrentIndex = listBreakpointOfBus.data.dt.Go.Station.indexOf(go[0]);
      result.push({
        fleetCode:fleetCode, 
        stationID:listBreakpointOfBus.data.dt.Go.Station[currrentIndex -1].Code,
        station:listBreakpointOfBus.data.dt.Go.Station[currrentIndex -1].Name})
    }
    else{
      let re = listBreakpointOfBus.data.dt.Re.Station.filter((value) => value['Code'] == currentObjectID)
      if(re.length != 0){
        result.push({
          fleetCode:fleetCode, 
          stationID:currentObjectID.toString(),
          station:re[0].Name})

        let currrentIndex = listBreakpointOfBus.data.dt.Re.Station.indexOf(re[0]);
        result.push({
          fleetCode:fleetCode, 
          stationID:listBreakpointOfBus.data.dt.Re.Station[currrentIndex -1].Code,
          station:listBreakpointOfBus.data.dt.Re.Station[currrentIndex -1].Name})
      }
    }
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
        return {
          data : [...state.data, ...action.value]
        };
      default:
        return new Error();
    }
  }
  const [list_result,setListResult] = React.useState([]);
  const [list_bus,dispatch] = React.useReducer(reducer,{data:[]});
  React.useEffect(() => {
    
     
      let requests = []
      for(let i in list_bus.data){
          requests.push(getVehicle(list_bus.data[i].fleetCode, list_bus.data[i].stationID))
      }
      setTimeout(() => {
        Axios.all(requests).then(Axios.spread((...res ) => {
        
          for(let i in list_bus.data){
            res[i]['station'] = list_bus.data[i].station;
          }
          setListResult(res)
        }))
      },[3000])

  })
  
  return (
    <div className="App">
     
        <div className="list-bus">
      
            {list_result.length != 0 && list_result.map((value,index) => {
              return(<BusComponent key={index}
                code = {value.data.dt[0].BienKiemSoat}

               fleetCode={value.data.dt[0].Fleet}
               partRemained = {value.data.dt[0].PartRemained}
               timeRemained = {value.data.dt[0].TimeRemained}
               station = {value.station}
               />)
            })}
            </div>
        
        <div className="Logo">
          <AddBusChecking setValue = {(payload) => dispatch(payload)}/>
        </div>
    </div>

  );
}

export default App;
