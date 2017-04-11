/**
 * @author vasturiano
 *
 * Based on code from THREE.FirstPersonControls
 */

THREE.ToggleMovementControls = function ( camera, domElement ) {
  this.domElement = ( domElement !== undefined ) ? domElement : document;

  var ZAXIS = new THREE.Vector3(0, 0, 1);
  var YAXIS = new THREE.Vector3(0, 1, 0);

  this.object = new THREE.Object3D();

  this.enabled = true;
  this.movementSpeed = 1.0;
  this.angle = 0;

  this.angleQuaternion = new THREE.Quaternion();

  this.moveForward = false;
  this.moveBackward = false;
  this.moveLeft = false;
  this.moveRight = false;

  this.onClick = function(event) {
    this.moveForward = !this.moveForward; // Toggle forward movement
    this.moveBackward = 0;
    this.moveUp = 0;
    this.moveDown = 0;
  };

  var setFromQuaternionYComponent = function (dest, source) {
    var direction = ZAXIS.clone();
    direction.applyQuaternion(source);
    direction.sub(YAXIS.clone().multiplyScalar(direction.dot(YAXIS)));
    direction.normalize();
    dest.setFromUnitVectors(ZAXIS, direction);
  };

  var lastTimestamp = 0;
  this.update = function( timestamp ) {

    if ( !this.enabled ) return;

    camera.quaternion.multiplyQuaternions(this.angleQuaternion, camera.quaternion);
    setFromQuaternionYComponent(this.object.quaternion, camera.quaternion);

    var delta = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;
    var actualMoveSpeed = delta * this.movementSpeed;

    if ( this.moveForward ) this.object.translateZ( - actualMoveSpeed );
    if ( this.moveBackward ) this.object.translateZ( actualMoveSpeed );

    if ( this.moveLeft ) this.object.translateX( - actualMoveSpeed );
    if ( this.moveRight ) this.object.translateX( actualMoveSpeed );

    if ( this.moveUp ) this.object.translateY( actualMoveSpeed );
    if ( this.moveDown ) this.object.translateY( - actualMoveSpeed );

    camera.position.copy(this.object.position);
  };

  this.dispose = function() {
    this.domElement.removeEventListener( 'click', _onClick, false );
  };

  var _onClick = this.onClick.bind(this);

  this.domElement.addEventListener( 'click', _onClick, false );
};
