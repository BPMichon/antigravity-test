import { biomes, Biome } from './biomes.ts';

class BiomeSwiper {
    private currentIdx: number = 0;
    private likedBiomes: Biome[] = [];
    private dislikedBiomes: Biome[] = [];
    private isShaders: boolean = false;

    private cardStack: HTMLElement;
    private resultsScreen: HTMLElement;
    private swiperContainer: HTMLElement;
    private likedList: HTMLElement;
    private dislikedList: HTMLElement;

    private btnYes: HTMLButtonElement;
    private btnNo: HTMLButtonElement;
    private btnInfo: HTMLButtonElement;
    private btnRestart: HTMLButtonElement;

    constructor() {
        this.cardStack = document.getElementById('card-stack')!;
        this.resultsScreen = document.getElementById('results-screen')!;
        this.swiperContainer = document.getElementById('swiper-container')!;
        this.likedList = document.getElementById('liked-list')!;
        this.dislikedList = document.getElementById('disliked-list')!;

        this.btnYes = document.getElementById('btn-yes') as HTMLButtonElement;
        this.btnNo = document.getElementById('btn-no') as HTMLButtonElement;
        this.btnInfo = document.getElementById('btn-info') as HTMLButtonElement;
        this.btnRestart = document.getElementById('btn-restart') as HTMLButtonElement;

        this.init();
    }

    private init() {
        this.renderCard();

        this.btnYes.addEventListener('click', () => this.swipe('right'));
        this.btnNo.addEventListener('click', () => this.swipe('left'));
        this.btnInfo.addEventListener('click', () => this.toggleImageType());
        this.btnRestart.addEventListener('click', () => this.restart());
    }

    private toggleImageType() {
        this.isShaders = !this.isShaders;
        const label = this.btnInfo.querySelector('.label')!;
        label.textContent = this.isShaders ? 'Shaders' : 'Vanilla';

        // Update current card image if it exists
        const currentCardImg = this.cardStack.querySelector('.biome-image') as HTMLImageElement;
        if (currentCardImg && biomes[this.currentIdx]) {
            currentCardImg.src = this.isShaders ? biomes[this.currentIdx].shaders : biomes[this.currentIdx].vanilla;
        }
    }

    private renderCard() {
        if (this.currentIdx >= biomes.length) {
            this.showResults();
            return;
        }

        const biome = biomes[this.currentIdx];
        this.cardStack.innerHTML = `
      <div class="biome-card" style="z-index: ${biomes.length - this.currentIdx}">
        <div class="image-container">
          <img src="${this.isShaders ? biome.shaders : biome.vanilla}" alt="${biome.name}" class="biome-image">
        </div>
        <div class="card-info">
          <h2>${biome.name}</h2>
          <span class="biome-id">${biome.id}</span>
        </div>
      </div>
    `;

        // Add a slight "entry" animation
        const card = this.cardStack.firstElementChild as HTMLElement;
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9) translateY(20px)';

        requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1) translateY(0)';
        });
    }

    private swipe(direction: 'left' | 'right') {
        const card = this.cardStack.querySelector('.biome-card') as HTMLElement;
        if (!card) return;

        if (direction === 'right') {
            card.classList.add('swipe-right');
            this.likedBiomes.push(biomes[this.currentIdx]);
        } else {
            card.classList.add('swipe-left');
            this.dislikedBiomes.push(biomes[this.currentIdx]);
        }

        setTimeout(() => {
            this.currentIdx++;
            this.renderCard();
        }, 300);
    }

    private showResults() {
        this.swiperContainer.classList.add('hidden');
        this.resultsScreen.classList.remove('hidden');

        this.likedList.innerHTML = this.likedBiomes.map(b => `<li>${b.name}</li>`).join('');
        this.dislikedList.innerHTML = this.dislikedBiomes.map(b => `<li>${b.name}</li>`).join('');

        if (this.likedBiomes.length === 0) this.likedList.innerHTML = '<li>None yet! 😢</li>';
        if (this.dislikedBiomes.length === 0) this.dislikedList.innerHTML = '<li>You love everything! ✨</li>';
    }

    private restart() {
        this.currentIdx = 0;
        this.likedBiomes = [];
        this.dislikedBiomes = [];
        this.resultsScreen.classList.add('hidden');
        this.swiperContainer.classList.remove('hidden');
        this.renderCard();
    }
}

// Initialize app
new BiomeSwiper();
