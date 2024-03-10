
const lblPending = document.querySelector('#lbl-pending');
const deskHeader = document.querySelector('h1');
const noMoreAlert = document.querySelector('.alert');

const searchParams = new URLSearchParams( window.location.search ); // queryparams
// console.log(searchParams)

if( !searchParams.has('escritorio') ) {
	window.location = 'index.html';
	throw new Error('Escritorio es requerido');
}

const deskNumber = searchParams.get('escritorio');
deskHeader.innerText = deskNumber;

function checkTicketCount( currentCount = 0 ) {
	// noMoreAlert.classList.toggle('d-none');// ocultar el toggle
	// checkTicketCount( pending );
	
	if( currentCount === 0 ) {
		noMoreAlert.classList.remove('d-none');
	}else {
		noMoreAlert.classList.add('d-none');
	}
	lblPending.innerHTML = currentCount;
}



// numeros de tickets pendientes
async function loadInitialCount() {
    const pendingTickets = await fetch('/api/ticket/pending').then( resp => resp.json() );
    // lblPending.innerHTML = pending.length || 0;
	checkTicketCount( pendingTickets.length );
}


function connectToWebSockets() {

    const socket = new WebSocket( 'ws://localhost:3000/ws' );
  
    socket.onmessage = ( event ) => {
    //   console.log(event.data);// string --- on-ticket-count-changed
    //   const payload = JSON.parse( event.data ); // ahora es un objeto
    	const { type, payload } = JSON.parse( event.data ); 
    	if( type !== 'on-ticket-count-changed' ) return; 
    	// lblPending.innerHTML = payload; 
		checkTicketCount( payload );
    };
                  
    socket.onclose = ( event ) => {
    	console.log( 'Connection closed' );
      	setTimeout( () => {
        	console.log( 'retrying to connect' );
        	connectToWebSockets();
      	}, 1500 );
    };
  
    socket.onopen = ( event ) => {
    	console.log( 'Connected' );
    };
}



// Init
connectToWebSockets();
loadInitialCount();