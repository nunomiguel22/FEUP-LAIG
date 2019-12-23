
class CheckerAnimator {

    constructor(scene, selectedPiece) {
        this.scene = scene;
        this.selectedPiece = selectedPiece;
        this.selectedAnimation = null;
        this.moveAnimations = [];
    }

    setSelectAnimation(anim) { this.selectedAnimation = anim; }

    update(t) {
        //if (this.selectedPiece != null)
        this.selectedAnimation.update(t);
    }
}
