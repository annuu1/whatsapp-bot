import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

const BulkSend = () => {

  const [numbers, setNumbers] = useState([]);
    function handleSend() {
        fetch('http://localhost:3000/wa/send-bulk', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({numbers}),
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
    } 

    const handleFileChange = (e)=>{
        const file = e.target.files[0];
        if(!file) return
        let phnos = [];
        try{
          if(file.name.endsWith('.csv')){
            Papa.parse(file, {
              header: true,
              skipEmptyLines:true,
              complete: (result)=>{
                
                phnos = result.data.map(row => {
                  return row.numbers
                })
                setNumbers(phnos)
                // console.log(numbers);
              }
            })
          }else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')){
            const reader = new FileReader()

            reader.onload = (e)=>{
              const data = new Uint8Array(e.target.result);
              const workbook = XLSX.read(data, { type: 'array' });
              const sheetName = workbook.SheetNames[0];
              const sheet = workbook.Sheets[sheetName];
              const sheetData = XLSX.utils.sheet_to_json(sheet);
              phnos = sheetData.map(row => row.numbers)
              setNumbers(phnos)
                // console.log(numbers);
            }
            reader.readAsArrayBuffer(file)
          }
          else{
            alert('Invalid file type')
          }
        }
        catch(error){
          console.log(error)
          }
  }

  return (
    <>
    <h1>Bulk Send</h1>
    <input type="file" id="file" name="file" onChange={handleFileChange} />
    <button onClick={handleSend}>Send</button>
    {
      numbers.map((number, index)=> <p key={index}> {number} </p>)
    }
    </>
  );
};

export default BulkSend;