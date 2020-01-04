
class CheckerAnimator {

    constructor(scene, checkers) {
        this.scene = scene;
        this.checkers = checkers;
        this.selectedAnimation = null;
        this.moveAnimations = [];
        this.cameraAnimations = [];
    }

    setSelectAnimation(anim) { this.selectedAnimation = anim; }

    playMoveAnimation(anim) {
        anim.reset();
        this.moveAnimations.push(anim);
    }

    playCameraAnimation(camera) { this.cameraAnimations.push(camera); }

    reset() {
        this.moveAnimations = [];
    }

    isAnimatingMoves() { return this.moveAnimations.length; }

    update(t) {
        if (CheckerHuman.selectedPiece != null)
            this.selectedAnimation.update(t);

        for (let i in this.moveAnimations) {
            this.moveAnimations[i].update(t);
            if (this.moveAnimations[i].over)
                this.moveAnimations.splice(i, 1);
        }

        for (let i in this.cameraAnimations) {
            this.cameraAnimations[i].update(t);
            if (!this.cameraAnimations[i].animate)
                this.cameraAnimations.splice(i, 1);
        }
    }
}
