 // Environment setup
 const canvas = document.querySelector('canvas')
 const c = canvas.getContext("2d")

 // Changes the canvas based on the window size when the page is loaded
 // window part is not necessary but I left it in for clarity
 canvas.width = window.innerWidth
 canvas.height = window.innerHeight

 const gravity = 0.15; // World's gravity when falling down
 var xSpeed = 2 // Player's movement speed on X-axis
 var yForce = 8 // Player's jump force
 var canJump = true // Is the player allowed to jump
 var endGamePos = 1500 // (Approximate) end of the level
 var jumpingCD = 800 // Cooldown (in ms) before the player can jump again

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
         this.width = 30
         this.height = 30
    }
    
    draw(){
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y <= canvas.height)
        this.velocity.y += gravity
        else this.velocity.y = 0
    }
 }

 class Platform {
    constructor({x, y}){

        this.position = {
            // Code shortcut
            // x = x: x,
            // y = y: y
            x,
            y
        }

        this.width = 200
        this.height = 20

    }

    draw() {
        c.fillStyle = 'blue'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
 }

 const player = new Player()
 const platforms = [new Platform({
    x: 200, 
    y: 100
 }), new Platform({
    x: 500, 
    y: 150
 })]
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

 // Future function for the end of the game / level
 function endGame(){
    if (scrollOffset >= endGamePos && !endGameReached){
        endGameReached = true;
        console.log("End of demo!")
    }
 }

 // Prevents the player from holding the button and skyrocketing
 function JumpDisabled(){
    setTimeout(function(){canJump = true}, jumpingCD)
 }

 // Pretty straightforward, updates the screen
 function animate(){
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    player.update()
    platforms.forEach((platform) => {
        platform.draw()
    }) // Looping through an array

    /*Last part of the first condition is from me, it prevents the player from going to one side
    if both keys are pressed at the same time. We have to watch out for it since it might cause
    some problems later on */
    if (keys.right.pressed && !keys.left.pressed && player.position.x < 400)
        player.velocity.x = xSpeed
    else if (keys.left.pressed && !keys.right.pressed && player.position.x > 50)
        player.velocity.x = -xSpeed
    else {
        player.velocity.x = 0

        if (keys.right.pressed){
            scrollOffset += xSpeed
            platforms.forEach((platform) => {
                platform.position.x -= xSpeed
            })
        }
        else if (keys.left.pressed){
            scrollOffset -= xSpeed
            platforms.forEach((platform) => {
                platform.position.x += xSpeed
            })
        }
    }

    // Collision with platforms code
    platforms.forEach((platform) => {
        if (player.position.y + player.height <= platform.position.y && 
            player.position.y + player.height + player.velocity.y >= platform.position.y &&
            player.position.x + player.width >= platform.position.x && 
            player.position.x <= platform.position.x + platform.width){
            player.velocity.y = 0
        }
    })
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