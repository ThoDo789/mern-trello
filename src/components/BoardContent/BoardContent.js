import Column from 'components/Column/Column'
import React, { useEffect, useState } from 'react'
import './BoardContent.scss'
import { isEmpty } from 'lodash'
import { initialData } from 'actions/initialData'
import { mapOrder } from 'ultilities/sorts'
import { Container, Draggable } from 'react-smooth-dnd'
import { applyDrag } from 'ultilities/dragDrop'

const BoardContent = () => {
const [board, setBoard] = useState({})
const [columns, setColumns] = useState([])

useEffect(() => {
  const boardFromDB = initialData.boards.find((board) => board.id === 'board-1' )
  if (boardFromDB) {
    
    setBoard(boardFromDB)
    //sort column
    setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id'))
  }
}, [])
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
                <Column column={column} onCardDrop={onCardDrop} />
              </Draggable>
          ))}
              <div className="add-new-column">
        <i className="fa fa-plus icon"></i>
          Add new card
      </div>
      </Container>
  
    </div>
  )
}

export default BoardContent
