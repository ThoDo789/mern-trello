import Card from 'components/Card/Card'
import React, { useEffect, useRef, useState } from 'react'
import './Column.scss'
import { mapOrder } from 'ultilities/sorts'
import { Container, Draggable } from 'react-smooth-dnd'
import { Dropdown ,Form, Button} from 'react-bootstrap'
import ConfirmModal from 'components/common/ConfirmModal'
import {MODAL_ACTION_CONFIRM} from "ultilities/contants"
import {saveContentAfterPressEnter, selectAllInlineText} from "ultilities/contentEditable"
import {cloneDeep} from "lodash"

const Column = ({ column, onCardDrop, onUpdateColumn}) => {
  const cards = mapOrder(column.cards, column.cardOrder, 'id');

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const toggleConfirmModal =()=> setShowConfirmModal(!showConfirmModal)
 
  const [columnTitle, setColumnTitle] = useState('')
  const handleColumnTitleChange=(e)=>setColumnTitle(e.target.value)


  const [openNewCardForm, setOpenNewCardForm] = useState(false) 
  const toggleNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

  const newCardTextareaRef = useRef(null);

  const [newCardTitle, setNewCardTitle] = useState([])
  const onNewTitleCardChange = (e) => setNewCardTitle(e.target.value);

  const addNewCard=()=>{
    if(!newCardTitle){
      newCardTextareaRef.current.focus()
      return
    }
    const newCardToAdd={
      id:Math.random().toString(36).substr(2,5) ,// random characcter
      boardId:column.boardId,
     columnId:column.id,
     title:newCardTitle.trim(),
     cover:null
    }
    console.log(newCardToAdd)
    let newColumn = cloneDeep(column);
    newColumn.cards.push(newCardToAdd)
    newColumn.cardOrder.push(newCardToAdd.id)

    onUpdateColumn(newColumn)

    setNewCardTitle('')
    toggleNewCardForm()

  }


  const handleColumnTitleBlur = () => {
    const newColumn ={
      ...column,
      title:columnTitle
    }
    onUpdateColumn(newColumn)
  };
  
  const onConfirmModalAction =(type)=>{
    if(type === MODAL_ACTION_CONFIRM){
        const newColumn ={
          ...column,
          _destroy:true
        }
        onUpdateColumn(newColumn)
    }
    toggleConfirmModal()
  }

useEffect(()=>{
setColumnTitle(column.title)
},[column.title])
useEffect(()=>{
  if(newCardTextareaRef && newCardTextareaRef.current){
    newCardTextareaRef.current.focus()
    newCardTextareaRef.current.select() 
  }
},[openNewCardForm])


  return (
    <div className="column">
      <header className="column-drag-handle">
        <div className="column-title">
          {/* {column.title} */}

          <Form.Control
            size="sm"
            type="text"
            className="trello-content-editable"
            spellCheck="false" // disable check bug bottom red line of text
            value={columnTitle}
            onChange={handleColumnTitleChange}
            onBlur={handleColumnTitleBlur}
            onKeyDown={saveContentAfterPressEnter}
            onClick={selectAllInlineText}
            onMouseDown={(e) => e.preventDefault()}
          />
        </div>
        <div className="column-dropdown-actions">
          <Dropdown>
            <Dropdown.Toggle variant="" id="dropdown-basic" size="sm">
              {/* <i className="fas fa-ellipsis-h icon"></i> */}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Add card...</Dropdown.Item>
              <Dropdown.Item href="#/action-2" onClick={toggleConfirmModal}>
                Remove column...
              </Dropdown.Item>
              <Dropdown.Item href="#/action-3">
                Move all card is this column ...
              </Dropdown.Item>
              <Dropdown.Item href="#/action-3">
                Archive all card is this column ...
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>
      <div className="card-list">
        <Container
          // onDragStart={e => console.log("drag started", e)}
          // onDragEnd={e => console.log("drag end", e)}
          // onDragEnter={() => {console.log("drag enter:", column.id)}}
          // onDragLeave={() => {console.log("drag leave:", column.id) }}
          // onDropReady={p => console.log('Drop ready: ', p)}
          orientation="vertical"
          groupName="col"
          onDrop={(dropResult) => onCardDrop(column.id, dropResult)}
          getChildPayload={(index) => cards[index]}
          dragClass="card-ghost"
          dropClass="card-ghost-drop"
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: "card-drop-preview",
          }}
          dropPlaceholderAnimationDuration={200}
        >
          {cards.map((card, index) => (
            <Draggable key={index}>
              <Card card={card} />
            </Draggable>
          ))}
        </Container>
        {openNewCardForm && 
        <div className="add-new-card-area">
        <Form.Control size="sm" 
            as="textarea"
            rows="3" 
            placeholder="Enter a title for this card..." 
            className="textarea-enter-new-card"
            ref={newCardTextareaRef}

           
            value={newCardTitle} 
            onChange={onNewTitleCardChange}
            onKeyDown={e=>(e.key === 'Enter') && addNewCard()}
             />
            
        </div>}
      </div>
     <footer>
     {openNewCardForm &&  <> <Button variant="success" size="sm" onClick={addNewCard}>Add card</Button>
      <span className="cancel-icon" onClick={toggleNewCardForm}><i className="fa fa-trash icon"></i></span></>}
      {!openNewCardForm && <div className="footer-actions" onClick={toggleNewCardForm}>
          <i className="fa fa-plus icon"></i>
          Add another card
        </div>}
      </footer>
      <ConfirmModal
        show={showConfirmModal}
        onAction={onConfirmModalAction}
        title={"Remove Column"}
        content={`Are you sure want to remove ${column.title} All  related card also be remove?`}
      />
    </div>
  );
}

export default Column
