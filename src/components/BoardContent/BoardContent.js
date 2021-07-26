import Column from 'components/Column/Column'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import './BoardContent.scss'
import { isEmpty } from 'lodash'
import { initialData } from 'actions/initialData'
import { mapOrder } from 'ultilities/sorts'
import { Container, Draggable } from 'react-smooth-dnd'
import { applyDrag } from 'ultilities/dragDrop'
import {Container as BootstrapContainer , Row, Col, Form,Button} from 'react-bootstrap'

const BoardContent = () => {
const [board, setBoard] = useState({})
const [columns, setColumns] = useState([])
const [openNewColumnForm, setOpenNewColumnForm] = useState(false) 
const newColumnRef = useRef(null);
const [newColumnTitle, setNewColumnTitle] = useState([])



useEffect(() => {
  const boardFromDB = initialData.boards.find((board) => board.id === 'board-1' )
  if (boardFromDB) {
    
    setBoard(boardFromDB)
    //sort column
    setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id'))
  }
}, [])

useEffect(()=>{
   if(newColumnRef && newColumnRef.current){
     newColumnRef.current.focus()
     newColumnRef.current.select() 
   }
},[openNewColumnForm])
const onNewTitleColumnChange = useCallback((e)=>{setNewColumnTitle(e.target.value)},[])

if (isEmpty(board)) {
  return <div className='not-found'>Board not found</div>
}

const onColumnDrop =(dropsResult)=>{
 
  let newColumns = [...columns]
  newColumns = applyDrag(newColumns,dropsResult)
  
  let newBoard ={...board}
  newBoard.columnOrder = newColumns.map(c=>c.id)
  newBoard.columns = newColumns

  setBoard(newBoard)
  setColumns(newColumns)
}
const onCardDrop =(columnId,dropResult)=>{
  if(dropResult.removedIndex !== null || dropResult.addedIndex !==null){
  let newColumns = [...columns]
  let currentColumn = newColumns.find(c=>c.id === columnId) 

      currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
      
      currentColumn.cardOrder = currentColumn.cards.map(item=>item.id)
      
    console.log(currentColumn,"dropResult")
    setColumns(newColumns)
  }
}
const toggleNewColumnForm =()=>{
    setOpenNewColumnForm(!openNewColumnForm)
}

const addNewColumn =()=>{
  if(!newColumnTitle){
    newColumnRef.current.focus()
  }
const newColumnToAdd={
        id:Math.random().toString(36).substr(2,5) ,// random characcter
        boardId:board.id,
        title:newColumnTitle.trim(),
        cardOrder:[],
        cards:[]
      }
let newColumns=[...columns]
      newColumns.push(newColumnToAdd)
    
let newBoard ={...board}
newBoard.columnOrder = newColumns.map(c=>c.id)
    newBoard.columns = newColumns

    setBoard(newBoard)
    setColumns(newColumns)
    setNewColumnTitle('')
    toggleNewColumnForm()// setOpenNewColumnForm(false)

    
}
const onUpdateColumn=(newColumnToUpdate)=>{

  const columnIdToUpdate= newColumnToUpdate.id
  let newColumns=[...columns]
  const columnIndexToUpdate = newColumns.findIndex(item=>item.id===columnIdToUpdate)
  
  if(newColumnToUpdate._destroy){
    //remove column
    newColumns.splice(columnIndexToUpdate,1)

  }else{
      //update column
      newColumns.splice(columnIndexToUpdate,1,newColumnToUpdate)
      
  }
  let newBoard ={...board}
  newBoard.columnOrder = newColumns.map(c=>c.id)
  newBoard.columns = newColumns

  setBoard(newBoard)
  setColumns(newColumns)
}


  return (
    <div className='board-content'>
      <Container
        orientation="horizontal"
        onDrop={onColumnDrop}
        getChildPayload={index =>columns[index]  }
        dragHandleSelector=".column-drag-handle"
        dropPlaceholder={{
                animationDuration: 150,
                showOnTop: true,
                className: 'column-drop-preview'
              }}
            >
            {columns.map((column, index) => (
              <Draggable  key={index} >
                <Column column={column} onCardDrop={onCardDrop} onUpdateColumn={onUpdateColumn} />
              </Draggable>
          ))}
     
      </Container>
        <BootstrapContainer>
        {openNewColumnForm && <Row>
            <Col className="enter-new-column">
            <Form.Control size="sm" 
            type="text" 
            placeholder="Enter column title..." 
            className="input-enter-new-column"
            ref={newColumnRef}
            value={newColumnTitle} 
            onChange={onNewTitleColumnChange}
            onKeyDown={e=>(e.key === 'Enter') && addNewColumn()}
             />
             <Button variant="success" size="sm" onClick={addNewColumn}>Add column</Button>
             <span className="cancel-new-column" onClick={toggleNewColumnForm}><i className="fa fa-trash icon"></i></span>
            </Col>
         </Row>}
         {!openNewColumnForm && <Row>
            <Col className="add-new-column" onClick={toggleNewColumnForm}>
               <i className="fa fa-plus icon"></i>
                Add new card
            </Col>
          </Row>}
        </BootstrapContainer>
    </div>
  )
}

export default BoardContent
