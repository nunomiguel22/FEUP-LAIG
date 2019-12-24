
class CheckerAnimator {

    constructor(scene, selectedPiece) {
        this.scene = scene;
        this.selectedPiece = selectedPiece;
        this.selectedAnimation = null;
        this.moveAnimations = [];
    }

    setSelectAnimation(anim) { this.selectedAnimation = anim; }

    playAnimation(anim) {
        anim.reset();
        this.moveAnimations.push(anim);
    }

    update(t) {
        //if (this.selectedPiece != null)
        this.selectedAnimation.update(t);
        for (let i = 0; i < this.moveAnimations.length; ++i) {
            this.moveAnimations[i].update(t);
            if (this.moveAnimations[i].over) {
                this.moveAnimations.splice(i, 1);
            }
        }
    }
}
