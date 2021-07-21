import Card from 'components/Card/Card'
import React from 'react'
import './Column.scss'
import { mapOrder } from 'ultilities/sorts'
import { Container, Draggable } from 'react-smooth-dnd'

const Column = ({ column }) => {
  const cards = mapOrder(column.cards, column.cardOrder, 'id')
  const onCardDrop =(dropsResult)=>{
      console.log(dropsResult,"card-drop")
  }

  return (
    <div className='column'>
      <header className="column-drag-handle">{column.title}</header>
      <div className='card-list'>

      <Container
          // onDragStart={e => console.log("drag started", e)}
          // onDragEnd={e => console.log("drag end", e)}
          // onDragEnter={() => {console.log("drag enter:", column.id)}}
          // onDragLeave={() => {console.log("drag leave:", column.id) }}
          // onDropReady={p => console.log('Drop ready: ', p)}
          orientation="vertical"
          groupName="col"
          onDrop={onCardDrop}
          getChildPayload={index =>cards[index] }
          dragClass="card-ghost"
          dropClass="card-ghost-drop"
          dropPlaceholder={{                      
            animationDuration: 150,
            showOnTop: true,
            className: 'card-drop-preview' 
          }}
          dropPlaceholderAnimationDuration={200}
         >
           {cards.map((card,index)=> 
              (<Draggable key={index} >
                      <Card card={card}/>
               </Draggable> 
           ))}
        </Container>
      </div>
      <footer>Add another card</footer>
    </div>

  )
}

export default Column
