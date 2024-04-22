const canvas = document.querySelector('canvas');
const toolsbtn = document.querySelectorAll('.tool');
const fillcolor = document.querySelector('#fill-color');
const sizeSlider = document.querySelector('#size-slider');
const colorbtns = document.querySelectorAll('.colors .option');
const colorPiker = document.querySelector('#color-picker');
const clearBoard = document.querySelector('.clear-board');
const saveImgbtn = document.querySelector('.save-img');
const context = canvas.getContext('2d');






// ------------------Declared Global variable with Default Values-------------

let prevMouseX;
let prevMouseY;
let snapShot;
let isDrawing = false;
let selectedTool = "brush";
let brushWidth = 2;
let selectedColor = "#000";








// -------------------setting canvas width/height offsetwidth/height returns viewable width/height of an element---------------

window.addEventListener('load', () => {

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    setCavasBackground();

});








// -------------------setting canvas background to white so downloded img will be white------------

const setCavasBackground = () => {

    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = selectedColor;

}









// -----------------------Function to draw a rectangle on a canvas based on mouse events--------------------------

const drawRectangle = (e) => {
    if (!fillcolor.checked)
    {
        return context.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    else
    {
        context.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
}







// -----------------------Function to draw a Circle on a canvas based on mouse events--------------------------
const drawCircle = (e) => {
    
    
    // creat new path for drawing a circle 
    context.beginPath() ; 
    
    
    //taking radius according to mouse movement
    let radius = Math.sqrt( Math.pow( ( prevMouseX - e.offsetX ) , 2  ) + Math.pow( (prevMouseY - e.offsetY) , 2 ) ) ;
    
    
    // creating circle according to the mouse pointer
    context.arc( prevMouseX , prevMouseY , radius , 0 , 2 * Math.PI ) ;
    
    
    // if fillColor is checked fill circle else draw border circle
    if( fillcolor.checked )
    {
        context.fill() ;
    }
    else context.stroke() ;
    
    
}















// -----------------------Function to draw a Triangle on a canvas based on mouse events--------------------------

const drawTriangle = (e) => {
    
    
    // creating a new path for drawing triangle 
    context.beginPath() ;   
    
    
    //moving triangle to mouse pointer 
    context.moveTo( prevMouseX , prevMouseY ) ;
    
    
    // creating first line according to mouse poiter  
    context.lineTo( e.offsetX , e.offsetY ) ;
    
    
    // creating bottom line of triangle  
    context.lineTo( prevMouseX*2 - e.offsetX , e.offsetY ) ;
    
    //closing the path of triangle so that 3rd line drawn automatically 
    context.closePath() ;
    
    
    //// if fillColor is checked fill triangle else draw border
    if( fillcolor.checked)
    {
        context.fill() ;
    }
    else context.stroke() ;
}













// -----------------------Function to draw a square on a canvas based on mouse events--------------------------


const drawSquare = (e) => {

    // Calculate the size of the square based on the difference between current and previous mouse positions
    const size = Math.min(Math.abs(prevMouseX - e.offsetX), Math.abs(prevMouseY - e.offsetY));
    

    // Determine the top-left corner coordinates of the square
    const startX = Math.min(e.offsetX, prevMouseX);
    const startY = Math.min(e.offsetY, prevMouseY);


    // Check if the fillcolor checkbox is not checked
    if (fillcolor.checked)
    {
        context.fillRect(startX, startY, size, size);
    }
    else
    {
        context.strokeRect(startX, startY, size, size);
    }
}












// --------------------------------Start Drawing on borad------------------------------------------


const startDraw = (e) =>{

    isDrawing = true  ;

    // passing current mouseX position as prevMouseX value  and mouseY position as prevMouseY value
    prevMouseX = e.offsetX ; 
    prevMouseY = e.offsetY ; 


    //creating new path  to draw 
    context.beginPath() ;


    // Set the line width of the drawing context to the value of `brushWidth`
    context.lineWidth = brushWidth ; 

    // Set the stroke color of the drawing context to the value of `selectedColor`
    context.strokeStyle = selectedColor ; 

    // Set the fill color of the drawing context to the value of `selectedColor`
    context.fillStyle = selectedColor ; 


    // copying canvas data & passing as snapshot value.. this avoids dragging the image
    snapShot = context.getImageData( 0 , 0 , canvas.width , canvas.height ) ;



}
















//--------------------------------------Drawing-----------------------------------------------------

const drawing = (e) => {

    
    if( !isDrawing )    return  ; 

    context.putImageData( snapShot , 0 , 0 );


    if( selectedTool === "brush" || selectedTool === "eraser" )
    {

        // if selected tool is eraser then set strokeStyle to white 
        context.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor ; 


        // draw line according to mouse pointer 
        context.lineTo( e.offsetX , e.offsetY ) ; 


        // drawing , filling  line with color ; 
        context.stroke() ;


    }
    else if( selectedTool === "rectangle" )
    {
        drawRectangle(e) ;
    }
    else if( selectedTool === "circle" ) 
    {
        drawCircle(e) ;
    }
    else if( selectedTool === "triangle" ) 
    {
        drawTriangle(e) ;
    }
    else
    {
        drawSquare(e) ;
    }


}













//-----------------------------------tools button working ---------------------------------------------


toolsbtn.forEach( btn => {



    // adding click event to all tool option

    btn.addEventListener( 'click' , () => {
        

        // Removes the 'active' class from the currently active tool option
        document.querySelector('.options .active').classList.remove("active") ;


        // Adds the 'active' class to the clicked tool option
        btn.classList.add("active");


        // Updating the selected tool based on the clicked button's id
        selectedTool = btn.id ; 

    });

});










// -----------------------------------------------buttons colors and pen selector--------------------------

sizeSlider.addEventListener('change' , () => brushWidth = sizeSlider.value );



colorbtns.forEach( btn => {

    btn.addEventListener('click' , () => {

        document.querySelector('.options .selected').classList.remove('selected');
        btn.classList.add('selected');

        selectedColor = window.getComputedStyle(btn).getPropertyValue('background-color');

    });
});









//--------------------------------------------------passing color------------------------------

colorPiker.addEventListener( 'change' , () => {


    // Changes the background color of the parent element of the color picker
    colorPiker.parentElement.style.background = colorPiker.value ; 


    // Triggers a click event on the parent element of the color picker
    colorPiker.parentElement.click() ;


});











// ---------------------------------------white board cleaar All working btn ----------------------------------

clearBoard.addEventListener( 'click' , () => {

    // clear whole board
    context.clearRect( 0 , 0 , canvas.width , canvas.height ) ;
    setCavasBackground() ;

});













//----------------------------------------save image btn woking-----------------------------------

saveImgbtn.addEventListener( 'click' , () => {


    // creating <a> element
    const link = document.createElement("a") ;


    // passing current date as link download value
    link.download = `${Date.now()}.jpg` ;


    // passing canvasData as link href value
    link.href = canvas.toDataURL() ;

    
    // clicking link to download image
    link.click() ;

});








//-----------------------------------------function call based on mouse------------------------------




/// Add event listener to start drawing when mouse button is pressed on the canvas
canvas.addEventListener('mousedown' , startDraw ) ;


// Add event listener to track mouse movement for drawing on the canvas
canvas.addEventListener('mousemove' , drawing ) ;


// Add event listener to stop drawing when mouse button is released on the canvas
canvas.addEventListener('mouseup' , () => isDrawing = false ) ;











