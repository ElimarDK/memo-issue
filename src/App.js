import React, { useState, memo } from 'react';
import './App.css';

function App() {
  return (
    <>

      <div className='container'>
        <h1>Well this sux...</h1>
        <Table rowCount={2} colCount={7} />
      </div>
    </>
  );
}

export default App;


export const Table = (props) => {

  const getInitialData = () => {
    return [...Array(props.rowCount)].map((x, i) => { return { id: i, isSelected: false }; })
  }

  const [data, setData] = useState(getInitialData);


  const onToogleSelected = (rowData) => {
    const preSelected = data.map(x => x.isSelected);

    rowData.isSelected = !rowData.isSelected;
    const nextState = data.map(x => x.id === rowData.id ? rowData : x);
    setData(nextState);
    const postSelected = data.map(x => x.isSelected);
    console.log('onToogleSelected (prev, next)', preSelected, postSelected)
    // Well we can conclude data is infact changed.
  }

  const toogleAll = () => {
    if (data.some((x) => x.isSelected)) {
      // Has some entities selected, deselect all
      data.forEach((v) => v.isSelected = false);
      setData([...data]);
    } else {
      // No one is selected
      data.forEach((v) => v.isSelected = true);
      setData([...data]);
    }
  }


  return (
    <table className='table table-sm table-bordered'>
      {console.log('render table', data.map(x => x.isSelected))}
      <TableHeader rowCount={props.rowCount} colCount={props.colCount} toogleAll={toogleAll} ></TableHeader>
      <TableBody data={data} colCount={props.colCount} onToogleSelected={onToogleSelected}></TableBody>
    </table>);
}

export const TableHeader = (props) => {
  return (
    <thead>
      <tr>
        <th onClick={props.toogleAll}>[ ]</th>
        {[...Array(props.colCount)].map((x, i) => <th key={`row-col-${i}`}>Col#{i}</th>)}
      </tr>
    </thead>
  )
}


export const TableBody = (props) => {
  return (
    <tbody>
      {console.log('TableBody', props.data.map(x => x.isSelected))}
      {props.data.map((data, i) => <MemoTableBodyRow key={`row-${i}`} data={data} colCount={props.colCount} onToogleSelected={props.onToogleSelected} />)}
      {/* {props.data.map((data, i) => <TableBodyRow key={`row-${i}`} data={data} colCount={props.colCount} onToogleSelected={props.onToogleSelected} />)} */}
    </tbody>
  )
}

const rowAreEqual = (prev, next) => {
  const areEqual = (prev.data.id === next.data.id) && (prev.data.isSelected === next.data.isSelected);

  console.log('  #' + prev.data.id + ' should re-render', !areEqual, 'prev', prev.data.isSelected, 'next', next.data.isSelected)
  if (!areEqual) {
    // Getting the equal data every time, even though when cloging the data value in Table functions states that data is not the same
    console.log('    Re-rednder, YAY!')
  }
  return areEqual;
}

// The memo wrapper is not getting the correct data in prev and next, values are always the same 
export const MemoTableBodyRow = memo((props) => {
  const toogleSelect = () => {
    props.onToogleSelected(props.data);
  }

  console.log('MemoTableBodyRow')

  return (<tr>
    {console.log('    Render TableBodyRow #' + props.data.id, props.data.isSelected)}
    <td onClick={toogleSelect} style={{ 'backgroundColor': props.data.isSelected ? 'red' : 'white' }}></td>
    {[...Array(props.colCount)].map((x, i) => <td key={`row-col-${i}`}>Col[{props.data.id},{i}]</td>)}
  </tr>)
}, rowAreEqual);


export const TableBodyRow = (props) => {
  const toogleSelect = () => {
    console.log('toogle selected on row #' + props.data.id, props)
    props.onToogleSelected(props.data);
  }

  return (<tr>
    {console.log('TableBodyRow', props.data.isSelected)}
    <td onClick={toogleSelect} style={{ 'backgroundColor': props.data.isSelected ? 'red' : 'white' }}></td>
    {[...Array(props.colCount)].map((x, i) => <td key={`row-col-${i}`}>Col[{props.data.id},{i}]</td>)}
  </tr>)
};



