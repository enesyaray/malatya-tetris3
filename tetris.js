class Tetris {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById('nextCanvas');
        this.nextCtx = this.nextCanvas.getContext('2d');
        
        this.BOARD_WIDTH = 10;
        this.BOARD_HEIGHT = 20;
        this.BLOCK_SIZE = 30;
        
        this.board = [];
        this.currentPiece = null;
        this.nextPiece = null;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.gameRunning = false;
        this.gamePaused = false;
        this.dropTime = 0;
        this.dropInterval = 1000;
        
        // Malatya sevgi dolu cümleleri listesi
        this.malatyaWords = [
            "HARİKASIN KAYISI YAPRAĞIM! 🍑",
            "SÜPERSİN KAYISI MARMELATIM! 🍯",
            "MUHTEŞEMSİN KURU KAYISIM! ✨",
            "BAYILDIM KAYISI REÇELİM! 🥰",
            "EFSANESİN KAYISI SUYUM! 💛",
            "ÇOK GÜZELSİN KAYISI ÇİÇEĞİM! 🌸",
            "MÜKEMMELSİN KAYISI TATLIM! 🍰",
            "SENİ SEVİYORUM KAYISI ÇEKİRDEĞİM! 💕",
            "HARİKA OYUN KAYISI ŞERBETİM! 🥤",
            "BAŞARILISIN KAYISI PASTAM! 🎂",
            "SÜPER GİDİYORSUN KAYISI DONDURMAM! 🍦",
            "ÇOK İYİSİN KAYISI KOMPOSTOM! 🥄",
            "EŞSİZSİN KAYISI ÇAYIM! ☕",
            "MUHTEŞEM OYUN KAYISI SABUNUM! 🧼",
            "HARİKASIN MALATYA KEBABIM! 🍖",
            "SÜPERSİN GÜN KURUSUM! ☀️",
            "BAYILDIM GÜL KURUSUM! 🌹",
            "ÇOK GÜZELSİN MALATYA MUTFAĞIM! 👨‍🍳",
            "MÜKEMMELSİN KAYISI ŞURUBUM! 🥤",
            "SENİ SEVİYORUM MALATYA KAYISIM! 💖",
            "HARİKA OYUN KAYISI YAPRAĞIM! 🍃",
            "BAŞARILISIN KAYISI ÇİÇEĞİM! 🌺",
            "SÜPER GİDİYORSUN KAYISI REÇELİM! 🍯",
            "ÇOK İYİSİN KAYISI MARMELATIM! 🥄",
            "EŞSİZSİN KAYISI SUYUM! 💧",
            "MUHTEŞEM OYUN KAYISI TATLIM! 🍭",
            "HARİKASIN KAYISI ÇEKİRDEĞİM! 🥜",
            "SÜPERSİN KAYISI PASTAM! 🎂",
            "BAYILDIM KAYISI DONDURMAM! 🍨",
            "ÇOK GÜZELSİN KAYISI KOMPOSTOM! 🥣",
            "MÜKEMMELSİN KAYISI ÇAYIM! 🫖",
            "SENİ SEVİYORUM KAYISI SABUNUM! 🧴",
            "HARİKA OYUN MALATYA KEBABIM! 🍽️",
            "BAŞARILISIN GÜN KURUSUM! 🌞",
            "SÜPER GİDİYORSUN GÜL KURUSUM! 🌷",
            "ÇOK İYİSİN MALATYA MUTFAĞIM! 🍳",
            "EŞSİZSİN KAYISI ŞURUBUM! 🥃",
            "MUHTEŞEM OYUN MALATYA KAYISIM! 🍑✨"
        ];
        
        this.currentWord = "";
        this.wordDisplayTime = 0;
        this.wordDisplayDuration = 2000; // 2 saniye göster
        
        // Malatya Kayısı Heykeli arka plan
        this.backgroundImages = [
            'gerekli materyaller/kayısı heykeli.jpg'
        ];
        this.currentBackgroundIndex = 0;
        this.backgroundChangeInterval = 30000;
        this.lastBackgroundChange = 0;
        
        // Müzik kontrolü
        this.musicEnabled = true; // Otomatik başlatma için true
        this.musicVolume = 0.2; // Çok düşük ses seviyesi
        this.zilgitEnabled = true;
        this.blockSoundEnabled = true;
        this.sexyVoiceEnabled = true;
        this.googleVoiceEnabled = true;
        
        this.colors = [
            null,
            '#FF0D72', // I
            '#0DC2FF', // J
            '#0DFF72', // L
            '#F538FF', // O
            '#FF8E0D', // S
            '#FFE138', // T
            '#3877FF'  // Z
        ];
        
        this.pieces = [
            // I piece
            [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            // J piece
            [
                [2, 0, 0],
                [2, 2, 2],
                [0, 0, 0]
            ],
            // L piece
            [
                [0, 0, 3],
                [3, 3, 3],
                [0, 0, 0]
            ],
            // O piece
            [
                [4, 4],
                [4, 4]
            ],
            // S piece
            [
                [0, 5, 5],
                [5, 5, 0],
                [0, 0, 0]
            ],
            // T piece
            [
                [0, 6, 0],
                [6, 6, 6],
                [0, 0, 0]
            ],
            // Z piece
            [
                [7, 7, 0],
                [0, 7, 7],
                [0, 0, 0]
            ]
        ];
        
        this.init();
    }
    
    init() {
        this.createBoard();
        this.bindEvents();
        this.drawBoard();
        this.drawNextPiece();
        
        // Ses sistemi başlatma
        this.initSpeechSynthesis();
    }
    
    initSpeechSynthesis() {
        // Speech synthesis API'sini başlat
        if ('speechSynthesis' in window) {
            // Seslerin yüklenmesini bekle
            speechSynthesis.onvoiceschanged = () => {
                console.log('Ses sistemi hazır');
            };
        }
    }
    
    createBoard() {
        this.board = [];
        for (let y = 0; y < this.BOARD_HEIGHT; y++) {
            this.board[y] = [];
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                this.board[y][x] = 0;
            }
        }
    }
    
    bindEvents() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('restartBtn').addEventListener('click', () => this.restartGame());
        
        // Müzik kontrolleri
        this.setupMusicControls();
        
        // Mobil dokunmatik kontroller
        this.setupTouchControls();
    }
    
    setupMusicControls() {
        const musicToggle = document.getElementById('musicToggle');
        const musicVolume = document.getElementById('musicVolume');
        const audio = document.getElementById('malatyaMusic');
        const zilgitAudio = document.getElementById('zilgitSound');
        const blockAudio = document.getElementById('blockPlaceSound');
        const blockAudio2 = document.getElementById('blockPlaceSound2');
        const sexyAudio = document.getElementById('sexyVoiceSound');
        
        // Müzik başlatma (kapalı başlar)
        if (this.musicEnabled) {
            audio.play().catch(e => console.log('Müzik başlatılamadı:', e));
        }
        
        musicToggle.addEventListener('click', () => {
            this.musicEnabled = !this.musicEnabled;
            if (this.musicEnabled) {
                audio.play();
                musicToggle.textContent = '🎵 Müzik Kapat';
            } else {
                audio.pause();
                musicToggle.textContent = '🔇 Müzik Aç';
            }
        });
        
        musicVolume.addEventListener('click', () => {
            this.musicVolume = this.musicVolume === 0.2 ? 0.5 : this.musicVolume === 0.5 ? 0.8 : 0.2;
            audio.volume = this.musicVolume;
            musicVolume.textContent = this.musicVolume === 0.2 ? '🔊' : this.musicVolume === 0.5 ? '🔊🔊' : '🔊🔊🔊';
        });
        
        audio.volume = this.musicVolume;
        zilgitAudio.volume = 0.6;
        blockAudio.volume = 0.4;
        blockAudio2.volume = 0.4;
        sexyAudio.volume = 0.5;
    }
    
    playZilgitSound() {
        if (!this.zilgitEnabled) return;
        
        const zilgitAudio = document.getElementById('zilgitSound');
        zilgitAudio.currentTime = 0; // Sesi baştan başlat
        zilgitAudio.volume = 0.4; // Düşük ses seviyesi
        zilgitAudio.play().catch(e => console.log('Zılgıt sesi çalınamadı:', e));
        
        // 2 saniye sonra sesi durdur
        setTimeout(() => {
            zilgitAudio.pause();
            zilgitAudio.currentTime = 0;
        }, 2000);
    }
    
    playBlockPlaceSound() {
        if (!this.blockSoundEnabled) return;
        
        // Basit bip sesi oluştur
        this.playAlternativeBlockSound();
    }
    
    playAlternativeBlockSound() {
        try {
            // Basit bir bip sesi oluştur
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.15);
        } catch (error) {
            console.log('Blok sesi oluşturulamadı:', error);
        }
    }
    
    playSexyVoiceSound() {
        if (!this.sexyVoiceEnabled) return;
        
        // Rastgele seksi ses seç
        const sexyVoices = ['sexyVoiceSound', 'sexyVoice1', 'sexyVoice2'];
        const randomVoice = sexyVoices[Math.floor(Math.random() * sexyVoices.length)];
        const sexyAudio = document.getElementById(randomVoice);
        
        sexyAudio.currentTime = 0; // Sesi baştan başlat
        sexyAudio.volume = 0.6; // Orta ses seviyesi
        sexyAudio.play().catch(e => console.log('Seksi ses çalınamadı:', e));
        
        // 3 saniye sonra sesi durdur
        setTimeout(() => {
            sexyAudio.pause();
            sexyAudio.currentTime = 0;
        }, 3000);
    }
    
    playGoogleTranslateVoice(text) {
        if (!this.googleVoiceEnabled) return;
        
        // Emojileri kaldır ve sadece metni al
        const cleanText = text.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim();
        
        // Google Translate API kullanarak ses oluştur
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'tr-TR'; // Türkçe
        utterance.rate = 1.2; // Daha hızlı
        utterance.pitch = 1.0; // Normal ton
        utterance.volume = 0.9; // Daha yüksek ses
        
        // Erkek sesi seç (mümkünse)
        const voices = speechSynthesis.getVoices();
        const maleVoice = voices.find(voice => voice.lang === 'tr-TR' && voice.name.includes('Male'));
        if (maleVoice) {
            utterance.voice = maleVoice;
        }
        
        speechSynthesis.speak(utterance);
    }
    
    setupTouchControls() {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;
        let isDropping = false;
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            touchStartTime = Date.now();
            isDropping = false;
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const touch = e.changedTouches[0];
            const deltaX = touch.clientX - touchStartX;
            const deltaY = touch.clientY - touchStartY;
            const deltaTime = Date.now() - touchStartTime;
            
            // Kısa dokunma - döndür
            if (deltaTime < 200 && Math.abs(deltaX) < 30 && Math.abs(deltaY) < 30) {
                this.rotatePiece();
            }
            // Yatay kaydırma - hareket
            else if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
                if (deltaX > 0) {
                    this.movePiece(1, 0);
                } else {
                    this.movePiece(-1, 0);
                }
            }
            // Dikey kaydırma - hızlı düşür (düzeltilmiş)
            else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50 && !isDropping) {
                if (deltaY > 0) {
                    isDropping = true;
                    this.softDrop();
                }
            }
        });
    }
    
    softDrop() {
        if (!this.currentPiece || this.gamePaused) return;
        
        // Yavaş düşürme - sadece bir kare aşağı
        if (this.movePiece(0, 1)) {
            // Başarılı hareket - skor ekle
            this.score += 1;
            this.updateDisplay();
        } else {
            // Çarpışma - parçayı yerleştir
            this.placePiece();
        }
    }
    
    startGame() {
        if (this.gameRunning) return;
        
        this.gameRunning = true;
        this.gamePaused = false;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.dropInterval = 1000;
        
        this.createBoard();
        this.spawnPiece();
        this.updateDisplay();
        
        // Müziği başlat
        if (this.musicEnabled) {
            const audio = document.getElementById('malatyaMusic');
            audio.play().catch(e => console.log('Müzik başlatılamadı:', e));
        }
        
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
        
        this.gameLoop();
    }
    
    togglePause() {
        if (!this.gameRunning) return;
        
        this.gamePaused = !this.gamePaused;
        const pauseBtn = document.getElementById('pauseBtn');
        pauseBtn.textContent = this.gamePaused ? 'Devam Et' : 'Duraklat';
        
        if (!this.gamePaused) {
            this.gameLoop();
        }
    }
    
    restartGame() {
        this.gameRunning = false;
        this.gamePaused = false;
        this.createBoard();
        this.currentPiece = null;
        this.nextPiece = null;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('pauseBtn').textContent = 'Duraklat';
        document.getElementById('gameOverModal').style.display = 'none';
        
        this.updateDisplay();
        this.drawBoard();
        this.drawNextPiece();
    }
    
    spawnPiece() {
        if (!this.nextPiece) {
            this.nextPiece = this.createPiece();
        }
        
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.createPiece();
        
        // Check if game over
        if (this.checkCollision(this.currentPiece)) {
            this.gameOver();
        }
        
        this.drawNextPiece();
    }
    
    createPiece() {
        const pieceIndex = Math.floor(Math.random() * this.pieces.length);
        const piece = this.pieces[pieceIndex];
        
        return {
            shape: piece,
            x: Math.floor(this.BOARD_WIDTH / 2) - Math.floor(piece[0].length / 2),
            y: 0
        };
    }
    
    checkCollision(piece, offsetX = 0, offsetY = 0) {
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x] !== 0) {
                    const newX = piece.x + x + offsetX;
                    const newY = piece.y + y + offsetY;
                    
                    if (newX < 0 || newX >= this.BOARD_WIDTH || 
                        newY >= this.BOARD_HEIGHT ||
                        (newY >= 0 && this.board[newY][newX] !== 0)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    movePiece(dx, dy) {
        if (!this.currentPiece || this.gamePaused) return;
        
        if (!this.checkCollision(this.currentPiece, dx, dy)) {
            this.currentPiece.x += dx;
            this.currentPiece.y += dy;
            return true;
        }
        return false;
    }
    
    rotatePiece() {
        if (!this.currentPiece || this.gamePaused) return;
        
        const rotated = this.rotateMatrix(this.currentPiece.shape);
        const originalShape = this.currentPiece.shape;
        this.currentPiece.shape = rotated;
        
        if (this.checkCollision(this.currentPiece)) {
            this.currentPiece.shape = originalShape;
        }
    }
    
    rotateMatrix(matrix) {
        const N = matrix.length;
        const rotated = [];
        
        for (let i = 0; i < N; i++) {
            rotated[i] = [];
            for (let j = 0; j < N; j++) {
                rotated[i][j] = matrix[N - 1 - j][i];
            }
        }
        
        return rotated;
    }
    
    dropPiece() {
        if (!this.currentPiece || this.gamePaused) return;
        
        while (this.movePiece(0, 1)) {
            // Continue dropping until collision
        }
        this.placePiece();
    }
    
    placePiece() {
        if (!this.currentPiece) return;
        
        for (let y = 0; y < this.currentPiece.shape.length; y++) {
            for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                if (this.currentPiece.shape[y][x] !== 0) {
                    const boardY = this.currentPiece.y + y;
                    const boardX = this.currentPiece.x + x;
                    if (boardY >= 0) {
                        this.board[boardY][boardX] = this.currentPiece.shape[y][x];
                    }
                }
            }
        }
        
        // Blok yerleşme sesi çal
        this.playBlockPlaceSound();
        
        this.clearLines();
        this.spawnPiece();
    }
    
    clearLines() {
        let linesCleared = 0;
        
        for (let y = this.BOARD_HEIGHT - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0)) {
                this.board.splice(y, 1);
                this.board.unshift(new Array(this.BOARD_WIDTH).fill(0));
                linesCleared++;
                y++; // Check the same line again
            }
        }
        
        if (linesCleared > 0) {
            this.lines += linesCleared;
            this.score += linesCleared * 100 * this.level;
            this.level = Math.floor(this.lines / 10) + 1;
            this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
            this.updateDisplay();
            
            // Zılgıt sesi çal
            this.playZilgitSound();
            
            // Malatya kelimesi göster
            this.showMalatyaWord();
        }
    }
    
    showMalatyaWord() {
        const randomIndex = Math.floor(Math.random() * this.malatyaWords.length);
        this.currentWord = this.malatyaWords[randomIndex];
        this.wordDisplayTime = Date.now();
        
        // Google Translate sesi çal
        this.playGoogleTranslateVoice(this.currentWord);
        
        // Seksi erkek sesi çal (opsiyonel)
        // this.playSexyVoiceSound();
    }
    
    handleKeyPress(e) {
        if (!this.gameRunning || this.gamePaused) return;
        
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.movePiece(-1, 0);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.movePiece(1, 0);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.movePiece(0, 1);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.rotatePiece();
                break;
            case ' ':
                e.preventDefault();
                this.dropPiece();
                break;
            case 'p':
            case 'P':
                e.preventDefault();
                this.togglePause();
                break;
        }
    }
    
    gameLoop() {
        if (!this.gameRunning || this.gamePaused) return;
        
        const now = Date.now();
        if (now - this.dropTime > this.dropInterval) {
            if (!this.movePiece(0, 1)) {
                this.placePiece();
            }
            this.dropTime = now;
        }
        
        this.drawBoard();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    drawBoard() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background image
        this.drawBackground();
        
        // Draw board with transparency
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw board
        for (let y = 0; y < this.BOARD_HEIGHT; y++) {
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                if (this.board[y][x] !== 0) {
                    this.drawBlock(x, y, this.board[y][x]);
                }
            }
        }
        
        // Draw current piece
        if (this.currentPiece) {
            for (let y = 0; y < this.currentPiece.shape.length; y++) {
                for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                    if (this.currentPiece.shape[y][x] !== 0) {
                        const boardX = this.currentPiece.x + x;
                        const boardY = this.currentPiece.y + y;
                        if (boardY >= 0) {
                            this.drawBlock(boardX, boardY, this.currentPiece.shape[y][x]);
                        }
                    }
                }
            }
        }
        
        // Draw Malatya word if active
        this.drawMalatyaWord();
    }
    
    drawBackground() {
        if (this.backgroundImages.length > 0) {
            const img = new Image();
            img.onload = () => {
                this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            };
            img.src = this.backgroundImages[this.currentBackgroundIndex];
        }
    }
    
    drawBackground() {
        const now = Date.now();
        if (now - this.lastBackgroundChange > this.backgroundChangeInterval) {
            this.currentBackgroundIndex = (this.currentBackgroundIndex + 1) % this.backgroundImages.length;
            this.lastBackgroundChange = now;
        }
        
        const img = new Image();
        img.onload = () => {
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
        };
        img.src = this.backgroundImages[this.currentBackgroundIndex];
    }
    
    drawBlock(x, y, colorIndex) {
        const color = this.colors[colorIndex];
        if (!color) return;
        
        const pixelX = x * this.BLOCK_SIZE;
        const pixelY = y * this.BLOCK_SIZE;
        
        this.ctx.fillStyle = color;
        this.ctx.fillRect(pixelX, pixelY, this.BLOCK_SIZE, this.BLOCK_SIZE);
        
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(pixelX, pixelY, this.BLOCK_SIZE, this.BLOCK_SIZE);
        
        // Add highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.fillRect(pixelX + 2, pixelY + 2, this.BLOCK_SIZE - 4, 4);
        this.ctx.fillRect(pixelX + 2, pixelY + 2, 4, this.BLOCK_SIZE - 4);
    }
    
    drawNextPiece() {
        this.nextCtx.clearRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        
        if (!this.nextPiece) return;
        
        const blockSize = 20;
        const offsetX = (this.nextCanvas.width - this.nextPiece.shape[0].length * blockSize) / 2;
        const offsetY = (this.nextCanvas.height - this.nextPiece.shape.length * blockSize) / 2;
        
        for (let y = 0; y < this.nextPiece.shape.length; y++) {
            for (let x = 0; x < this.nextPiece.shape[y].length; x++) {
                if (this.nextPiece.shape[y][x] !== 0) {
                    const color = this.colors[this.nextPiece.shape[y][x]];
                    if (color) {
                        this.nextCtx.fillStyle = color;
                        this.nextCtx.fillRect(
                            offsetX + x * blockSize,
                            offsetY + y * blockSize,
                            blockSize,
                            blockSize
                        );
                        
                        this.nextCtx.strokeStyle = '#000';
                        this.nextCtx.lineWidth = 1;
                        this.nextCtx.strokeRect(
                            offsetX + x * blockSize,
                            offsetY + y * blockSize,
                            blockSize,
                            blockSize
                        );
                    }
                }
            }
        }
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('lines').textContent = this.lines;
    }
    
    gameOver() {
        this.gameRunning = false;
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOverModal').style.display = 'block';
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
    }
    
    drawMalatyaWord() {
        if (this.currentWord && Date.now() - this.wordDisplayTime < this.wordDisplayDuration) {
            const alpha = Math.min(1, (this.wordDisplayDuration - (Date.now() - this.wordDisplayTime)) / 500);
            
            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            
            // Background
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Text
            this.ctx.fillStyle = '#FFD700';
            this.ctx.strokeStyle = '#FF6B35';
            this.ctx.lineWidth = 3;
            this.ctx.font = 'bold 28px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            
            // Split text into lines if it's too long
            const words = this.currentWord.split(' ');
            const lines = [];
            let currentLine = '';
            
            for (let word of words) {
                if (currentLine.length + word.length < 15) {
                    currentLine += (currentLine ? ' ' : '') + word;
                } else {
                    if (currentLine) lines.push(currentLine);
                    currentLine = word;
                }
            }
            if (currentLine) lines.push(currentLine);
            
            // Draw each line
            const lineHeight = 35;
            const startY = centerY - (lines.length - 1) * lineHeight / 2;
            
            for (let i = 0; i < lines.length; i++) {
                const y = startY + i * lineHeight;
                // Stroke text
                this.ctx.strokeText(lines[i], centerX, y);
                // Fill text
                this.ctx.fillText(lines[i], centerX, y);
            }
            
            // Subtitle
            this.ctx.font = 'bold 16px Arial';
            this.ctx.fillStyle = '#4ECDC4';
            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = 2;
            this.ctx.strokeText('🍑 MALATYA SEVGİSİ 🍑', centerX, centerY + 80);
            this.ctx.fillText('🍑 MALATYA SEVGİSİ 🍑', centerX, centerY + 80);
            
            this.ctx.restore();
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Tetris();
}); 
