import React from 'react'

import Axios from 'axios'
import {Modal,Button,InputGroup,FormControl} from 'react-bootstrap'
import './App.css';
import Logo from './add-button.svg'


// const convertStationToID = async (station) => {
//   let formData = new FormData();
//   formData.append('act','searchfull');
//   formData.append('typ','2');
//   formData.append('key',station)
//   return await Axios({
//     method:"POST",
//     url:"/Engine/Business/Search/action.ashx",
//     baseURL:"http://timbus.vn",
//     proxy:{
//       host:"http://timbus.vn",
//       port:80,
//     },
//     headers:{
//         'Accept': 'application/json, text/javascript, */*; q=0.01',
//         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
//         'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
//     },
//     data:formData
//   })
// }
const getVehicle = (fleetCode, stationID) =>{
    let formData = new FormData();
    formData.append('act','partremained');
    formData.append('State','true');
    formData.append('StationID',stationID);
    formData.append('FleetOver',fleetCode);
    
    return Axios({
      method:"POST",
      url:"/Engine/Business/Vehicle/action.ashx",
      baseURL:"http://timbus.vn",
      proxy:{
        host:"http://timbus.vn",
        port:80,
      },
      headers:{
        'Accept': 'application/json, text/javascript, */*; q=0.01',
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
    baseURL:"http://timbus.vn",
    proxy:{
      host:"http://timbus.vn",
      port:80,
    },
    headers:{
      'Accept': 'application/json, text/javascript, */*; q=0.01',
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
    baseURL:"http://timbus.vn",
    proxy:{
      host:"http://timbus.vn",
      port:80,
    },
    headers:{
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
  },
  data:formData,
  })
}

const searchListBreakPoint = async (key) => {
  let formData = new FormData();
  formData.append('act','listDiemDung');
  formData.append('keyword',key);
  return await Axios({
    method:"POST",
    url:"/Engine/Business/Search/action.ashx",
    baseURL:"http://timbus.vn",
    proxy:{
      host:"http://timbus.vn",
      port:80,
    },
    headers:{
      'Accept': 'application/json, text/javascript, */*; q=0.01',
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
  const [search_result, setSearchResult] = React.useState([]);
  const [currentObjectID, setCurrentObjectID] = React.useState(null);
  const [flag,setFlag] = React.useState(false);

  const set_address_data = async(value) =>{
    
    set_address(value);
    let searchListBreakpoint = await searchListBreakPoint(value)
    
    if(searchListBreakpoint.data.length > 0 && searchListBreakpoint.data.length < 3){
      setSearchResult(searchListBreakpoint.data);
      setFlag(true);
    }
    if(value.length === 0){
      setFlag(false)
    }
    
  }
  var result = [];

  const handleClose = () => setShow(false);
  const handleStart = async () => {
    
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
              placeholder="Address"
              value = {address}
              onChange = {(e) => set_address_data(e.target.value)}
            />  
            <div id="myInputautocomplete-list" class="autocomplete-items">
                { flag && <div>  
                {
                  search_result.map((value,index) => {
                      return(
                        <div 
                        key={index}
                        onClick={() => 
                          {
                            set_address(value.label); 
                            setFlag(false); 
                            setCurrentObjectID(value.id.toString())
                          }
                        }><p 
                        className="font-weight-bold mb-0 fs-15">
                          {value.label}</p>
                          <p className="mb-0 fs-13">station code: {value.id}</p>
                        </div>
                      )
                
                  
                  })
                }
     
                </div>} 
            </div>
          </InputGroup>
          <InputGroup className="mb-3">
            <FormControl
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              placeholder="Bus Code"
              value = {fleetCode}
              onChange = {(e) => set_fleet_code(e.target.value.toUpperCase())}
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
      case 'CLEAR':
        return {
          data: []
        }
      default:
        return new Error();
    }
  }
  const [list_result,setListResult] = React.useState([]);
  const [list_bus,dispatch] = React.useReducer(reducer,{data:[]});
  const [flag, setFlag] = React.useState(true);
  React.useEffect(() => {
    const lldata = JSON.parse(localStorage.getItem("list_bus"));
    if(lldata !== null){
      if( lldata.data.length !== 0) dispatch({type:"SET_VALUE",value:lldata.data})
    }
  },[])

  React.useEffect(() => {
     if(list_bus.data.length !== 0){
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
     }
   
  })
  const saveToLocalStorage = () => {
    localStorage.setItem("list_bus",JSON.stringify(list_bus))
  }
  const clearLocalStorage = () => {
    setFlag(false)
    dispatch({type:"CLEAR"})
    localStorage.removeItem("list_bus")
    setListResult([])
  }
  
  return (
    <div className="App">
        <div className="list-bus">
            {list_result.length !== 0 && flag && list_result.map((value,index) => {
              return(<BusComponent key={index}
                code = {value.data.dt[0].BienKiemSoat}

               fleetCode={value.data.dt[0].Fleet}
               partRemained = {value.data.dt[0].PartRemained}
               timeRemained = {value.data.dt[0].TimeRemained}
               station = {value.station}
               />)
            })}
            </div>
        <div className="Logo d-flex justify-content-around">
          <Button onClick={() => saveToLocalStorage()}>Save</Button>
          <AddBusChecking setValue = {(payload) => dispatch(payload)}/>
          <Button variant="danger" onClick={() => clearLocalStorage()}>Clear</Button>
        </div>
    </div>

  );
}

export default App;
