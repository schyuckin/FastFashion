 // Environment setup
 const platform = './img/conveyer.png' // This nomenclature might cause some problems later
 const tshirt = './img/tshirt.png'
 const background = './img/background.png'
 const hills = './img/hills.png'
 const canvas = document.querySelector('canvas')
 const c = canvas.getContext("2d")

 // Changed to a custom ratio for an optimized experience
 canvas.width = 1024 // window.innerWidth
 canvas.height = 576 // window.innerHeight
 
 const gravity = 0.15; // World's gravity when falling down
 var xSpeed = 2 // Player's movement speed on X-axis
 var yForce = 8 // Player's jump force

 var tshirtDropOffset = 50 // Specific to the t-shirt, falling updates

 var canJump = true // Is the player allowed to jump now
 var jumpingCD = 800 // Cooldown (in ms) before the player can jump again

 var endGamePos = 1500 // (Approximate) end of the level
 var parallaxMovement = 1 // Amount of movement applied to parallax backgrounds

 class Player {
    constructor(){
         this.position = {
            x:100,
            y:100
         }

         this.velocity = {
            x: 0,
            y: 0

         }
         this.width = 140
         this.height = 140
         this.image = createImage(tshirt)
    }
    
    draw(){
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y <= canvas.height)
        this.velocity.y += gravity
        else{

        }
    }
 }

 class Platform {
    constructor({x, y, image}){

        this.position = {
            // Code shortcut
            // x = x: x,
            // y = y: y
            x,
            y
        }
        
        this.image = image
        this.width = image.width
        this.height = image.height

    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
 }

 class GenericObject {
    constructor({x, y, image}){
        this.position = {
            // Code shortcut
            // x = x: x,
            // y = y: y
            x,
            y
        }
        
        this.image = image
        this.width = image.width
        this.height = image.height

    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
 }

 function createImage(imageSrc){
    const image = new Image()
    image.src = imageSrc
    return image
 }

 let platformImage = createImage(platform)

 let player = new Player()
 let platforms = [
    new Platform({
        x: -1, 
        y: 488,
        image: platformImage
 }), 
 new Platform({
    x: platformImage.width - 3, 
    y: 488,
    image: platformImage
 }),
 new Platform({
    x: platformImage.width * 2 + 100, 
    y: 488,
    image: platformImage
 }),
]

 let genericObjects = [new GenericObject({
    x: -1,
    y: -1,
    image: createImage(background)
 }), new GenericObject({
    x: -1,
    y: -1,
    image: createImage(hills)
 }), 
]
 // "Keys" is constant, but its values are not
  const keys = {
    right: {
        pressed: false
    },
    left:  {
        pressed: false
    }
 }

 let scrollOffset = 0
 let endGameReached = false

 function init(){

    platformImage = createImage(platform)
    player = new Player()
    platforms = [
    new Platform({
        x: -1, 
        y: 488,
        image: platformImage
 }), 
 new Platform({
    x: platformImage.width - 3, 
    y: 488,
    image: platformImage
 }),
 new Platform({
    x: platformImage.width * 2 + 100, 
    y: 488,
    image: platformImage
 }),
]   
    genericObjects = [new GenericObject({
    x: -1,
    y: -1,
    image: createImage(background)
 }), new GenericObject({
    x: -1,
    y: -1,
    image: createImage(hills)
 }), 
]

}


 // Future function for the end of the game / level
 function endGame(){

    if (scrollOffset > endGamePos & !endGameReached) {
        endGameReached = true;
        console.log("You won the game!")
    }
 }

 function loseCondition(){
    if (player.position.y > canvas.height){
        init()
        scrollOffset = 0
    }
 }

 // Prevents the player from holding the button and skyrocketing
 function JumpDisabled(){
    setTimeout(function(){canJump = true}, jumpingCD)
 }

 // Pretty straightforward, updates the screen
 function animate(){
    requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)

    genericObjects.forEach((genericObject) => {
        genericObject.draw()
    })
     // Looping through an array
    platforms.forEach((platform) => {
        platform.draw()
    })
    player.update()

    /*Last part of the first condition is from me, it prevents the player from going to one side
    if both keys are pressed at the same time. We have to watch out for it since it might cause
    some problems later on */
    if (keys.right.pressed && !keys.left.pressed && player.position.x < 400)
        player.velocity.x = xSpeed
    else if ((keys.left.pressed && !keys.right.pressed && player.position.x > 50)|| (keys.left.pressed && scrollOffset == 0 && player.position.x > 0))
        player.velocity.x = -xSpeed
    else {
        player.velocity.x = 0

        if (keys.right.pressed){
            scrollOffset += xSpeed
            platforms.forEach((platform) => {
                platform.position.x -= xSpeed
            })
            genericObjects.forEach(genericObject => {
            genericObject.position.x -=parallaxMovement    
            })
        }
        else if (keys.left.pressed && scrollOffset > 0){
            scrollOffset -= xSpeed
            platforms.forEach((platform) => {
                platform.position.x += xSpeed
            })
            genericObjects.forEach(genericObject => {
                genericObject.position.x += parallaxMovement    
                })
        }
    }

    // Collision with platforms code
    platforms.forEach((platform) => {
        if (player.position.y + player.height <= platform.position.y && 
            player.position.y + player.height + player.velocity.y >= platform.position.y &&
            player.position.x + player.width - tshirtDropOffset >= platform.position.x && 
            player.position.x <= platform.position.x + platform.width - tshirtDropOffset){
            player.velocity.y = 0
        }
    })

    loseCondition()
    endGame()
 }

 animate()

 // Waits for user inputs, in this case key being pressed or released
 // KeyCode is apparently deprecated and we should switch to key = "Letter" instead
 // But I'm not touching that yet
 window.addEventListener('keydown', ({keyCode}) => {
      switch (keyCode){
        case 65:
            keys.left.pressed = true
            break

        case 83:
            break

        case 68:
            keys.right.pressed = true   
            break

        case 87:
            if (canJump){
                canJump = false
                player.velocity.y -= yForce
                JumpDisabled()
            }
            break  
      }
 } )
 
 window.addEventListener('keyup', ({keyCode}) => {
    switch (keyCode){
      case 65:
          keys.left.pressed = false
          break

      case 83:
          break

      case 68:
          keys.right.pressed = false 
          break

      case 87:
          // Weird leftover that causes object twitching
          // player.velocity.y -= 5
          break  
    }
} )