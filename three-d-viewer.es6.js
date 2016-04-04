'use strict';

class ThreeDViewer {
    get LOADING_ERROR() {
        return 'Could not load file.';
    }

    beforeRegister() {
        this.is = 'three-d-viewer';
        this.properties = {
            previews: {
                type: Array,
                observer: 'previewsChanged'
            },
            color: {
                type: String,
                value: 'cccccc',
                observer: '_changeModelColor'
            },
            options: {
                type: Object,
                value: () => {
                    return {};
                }
            }
        };
    }

    unloadObj() {
        this.viewer.unloadObj();
        this.isThreeDViewerReady = false;
    }

    showPreview(preview) {
        return this.selectedPreview === preview;
    }

    showViewerArrows(previews) {
        return previews && previews.length > 1;
    }

    showPreviousPreview() {
        this.unloadObj();
        this.selectedIndex = (this.selectedIndex - 1) % this.previews.length;
        if (this.selectedIndex < 0) {
            this.selectedIndex = this.previews.length - 1;
        }
        this.getPreviewPath(this.previews[this.selectedIndex]);
    }

    showNextPreview() {
        this.unloadObj();
        this.selectedIndex = (this.selectedIndex + 1) % this.previews.length;
        this.getPreviewPath(this.previews[this.selectedIndex]);
    }

    renderModel(index) {
        //index = index || 0;
        this.viewer.render('#three-d-viewer');
        this.viewer.resize();
        this.viewer.loadObject(this.currentModelUrl, this.fileExtension, () => {
            this.isThreeDViewerReady = true;
            this.viewer.startRotating();
            this.viewer.changeColor(this.color);
        }, () => {
            this.setLoadingFileErrorMessage();
            this.viewer.stopRotating();
            this.isThreeDViewerReady = false;
        });
    }

    computeErrorClass(loadingMessage) {
        return loadingMessage === this.LOADING_ERROR ? 'error' : '';
    }

    getPreviewPath(prev) {
        this.set('loadingMessage', 'Loading...');
        let preview = prev || this.previews[0];
        this.selectedPreview = preview;
        this.selectedIndex = this.previews.indexOf(preview);

        this.fileExtension = preview.file_type;
        this.currentModelUrl = preview.file_url;
        setTimeout(() => {
            this.renderModel();
        });
    }

    setLoadingFileErrorMessage() {
        this.set('loadingMessage', this.LOADING_ERROR);
    }

    previewsChanged() {
        if (this.previews && this.previews.length > 0) {
            this.isThreeDViewerReady = false;
            this.getPreviewPath();
        }
    }

    ready() {
        this.viewer = new Viewer();
        this.viewer.init();

    }

    _changeModelColor() {
        if (this.viewer) {
            this.viewer.changeColor(this.color);
        }
    }
}

Polymer(ThreeDViewer);
