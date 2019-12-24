
class CheckerAnimator {

    constructor(scene, checkerLogic) {
        this.scene = scene;
        this.checkerLogic = checkerLogic;
        this.selectedAnimation = null;
        this.moveAnimations = [];
    }

    setSelectAnimation(anim) { this.selectedAnimation = anim; }

    playAnimation(anim) {
        anim.reset();
        this.moveAnimations.push(anim);
    }

    update(t) {
        if (this.checkerLogic.selectedPiece != null)
            this.selectedAnimation.update(t);
        for (let i = 0; i < this.moveAnimations.length; ++i) {
            this.moveAnimations[i].update(t);
            if (this.moveAnimations[i].over) {
                this.moveAnimations.splice(i, 1);
            }
        }
    }
}
