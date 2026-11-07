/**
 * INCA PILATES & YOGA STUDIO - SEARCHABLE SELECT / COMBOBOX ENGINE
 * Mengubah elemen <select> standar menjadi input pencarian (searchable combobox).
 * Pengguna dapat mengetik langsung nama, kode, nomor HP, atau kata kunci apapun
 * untuk menemukan data secara instan tanpa perlu scroll dropdown yang panjang.
 * Sinkronisasi 2 arah otomatis dengan elemen <select> bawaan & form validation.
 */

(function(window, document) {
  'use strict';

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  const activeInstances = new Set();

  class IncaSearchableSelect {
    constructor(selectElement, options = {}) {
      if (!selectElement) return;
      if (selectElement._incaSearchableSelect) {
        selectElement._incaSearchableSelect.sync();
        return selectElement._incaSearchableSelect;
      }

      this.select = selectElement;
      this.select._incaSearchableSelect = this;

      // Deteksi style compact / toolbar filter
      const isCompact = options.compact !== undefined ? options.compact : (
        this.select.classList.contains('py-1.5') ||
        this.select.classList.contains('py-1') ||
        this.select.id.includes('Filter') ||
        this.select.id.startsWith('filter')
      );

      this.options = {
        placeholder: options.placeholder || this.select.getAttribute('data-placeholder') || 'Ketik untuk mencari...',
        compact: isCompact,
        autoFlip: true,
        ...options
      };

      this.isOpen = false;
      this.highlightedIndex = -1;
      this.allItems = [];
      this.filteredItems = [];
      this._isUserInput = false;

      this.buildDOM();
      this.readOptions();
      this.interceptValueSetter();
      this.observeMutations();
      this.bindEvents();
      this.sync();

      activeInstances.add(this);
    }

    buildDOM() {
      // 1. Wrapper Kontainer
      this.wrapper = document.createElement('div');
      this.wrapper.className = 'inca-ss-wrapper relative text-xs font-sans';
      
      // Salin utility width dari select asli
      const widthClasses = Array.from(this.select.classList).filter(c => 
        c.startsWith('w-') || c.startsWith('sm:w-') || c.startsWith('md:w-') || c.startsWith('max-w-')
      );
      if (widthClasses.length > 0) {
        this.wrapper.classList.add(...widthClasses);
      } else {
        this.wrapper.classList.add('w-full');
      }

      if (this.options.compact) {
        this.wrapper.classList.add('inca-ss-compact');
        if (!this.wrapper.style.minWidth) {
          this.wrapper.style.minWidth = '160px';
        }
      }

      // Sembunyikan elemen <select> asli secara visual tapi tetap aktif di DOM
      this.select.style.setProperty('position', 'absolute', 'important');
      this.select.style.setProperty('opacity', '0', 'important');
      this.select.style.setProperty('pointer-events', 'none', 'important');
      this.select.style.setProperty('width', '1px', 'important');
      this.select.style.setProperty('height', '1px', 'important');
      this.select.style.setProperty('margin', '-1px', 'important');
      this.select.style.setProperty('z-index', '-1', 'important');
      this.select.setAttribute('tabindex', '-1');

      // Sisipkan wrapper di posisi select asli
      this.select.parentNode.insertBefore(this.wrapper, this.select);
      this.wrapper.appendChild(this.select);

      // 2. Kontrol Input Pencarian
      this.control = document.createElement('div');
      this.control.className = 'inca-ss-control flex items-center relative border border-gray-300 rounded-xl bg-white shadow-xs transition hover:border-gray-400 focus-within:ring-2 focus-within:ring-sage-500 focus-within:border-sage-500 cursor-text w-full';
      if (this.options.compact) {
        this.control.classList.add('py-1', 'px-2.5');
      } else {
        this.control.classList.add('py-2', 'px-3');
      }

      // Ikon kaca pembesar (Search Magnifier)
      const iconWrap = document.createElement('div');
      iconWrap.className = 'inca-ss-icon text-gray-400 mr-2 flex-shrink-0 flex items-center pointer-events-none select-none';
      iconWrap.innerHTML = `
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      `;
      this.control.appendChild(iconWrap);

      // Input teks pencarian
      this.input = document.createElement('input');
      this.input.type = 'text';
      this.input.className = 'inca-ss-input w-full bg-transparent text-xs text-gray-800 placeholder-gray-400 font-medium outline-none truncate';
      this.input.placeholder = this.options.placeholder;
      this.input.autocomplete = 'off';
      this.input.spellcheck = false;
      this.control.appendChild(this.input);

      // Aksi Kanan (Clear ✕ & Chevron ▾)
      const actionWrap = document.createElement('div');
      actionWrap.className = 'flex items-center gap-1 ml-1 flex-shrink-0 select-none';

      // Tombol Hapus / Clear ✕
      this.clearBtn = document.createElement('button');
      this.clearBtn.type = 'button';
      this.clearBtn.className = 'inca-ss-clear hidden text-gray-400 hover:text-gray-700 p-0.5 rounded text-xs font-bold leading-none transition';
      this.clearBtn.title = 'Hapus pencarian';
      this.clearBtn.innerHTML = '✕';
      actionWrap.appendChild(this.clearBtn);

      // Tombol Chevron Dropdown ▾
      this.arrowBtn = document.createElement('button');
      this.arrowBtn.type = 'button';
      this.arrowBtn.className = 'inca-ss-arrow text-gray-400 hover:text-gray-600 p-0.5 rounded transition';
      this.arrowBtn.tabIndex = -1;
      this.arrowBtn.innerHTML = `
        <svg class="w-3.5 h-3.5 transform transition-transform duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      `;
      actionWrap.appendChild(this.arrowBtn);

      this.control.appendChild(actionWrap);
      this.wrapper.appendChild(this.control);

      // 3. Dropdown Menu List
      this.dropdown = document.createElement('div');
      this.dropdown.className = 'inca-ss-dropdown hidden absolute left-0 top-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden text-xs';
      
      // Z-Index: Dalam modal gunakan 70 (di atas backdrop modal z-50), di luar modal gunakan 40
      const isInsideModal = Boolean(this.wrapper.closest('.fixed, [id$="Modal"], dialog'));
      this.dropdown.style.zIndex = isInsideModal ? '70' : '40';
      this.dropdown.style.minWidth = '100%';
      this.dropdown.style.width = 'max-content';
      this.dropdown.style.maxWidth = 'min(500px, 92vw)';

      // Bar status info atas
      this.headerBar = document.createElement('div');
      this.headerBar.className = 'inca-ss-header px-3 py-1.5 bg-gray-50/95 border-b border-gray-100 flex items-center justify-between text-[10px] text-gray-500 font-medium select-none';
      this.headerBar.innerHTML = `
        <span class="inca-ss-count font-semibold text-sage-800">Pilih opsi</span>
        <span class="text-gray-400 hidden sm:inline">Ketik nama/kode · ↑ ↓ &amp; Enter</span>
      `;
      this.dropdown.appendChild(this.headerBar);

      // Wadah daftar opsi
      this.list = document.createElement('div');
      this.list.className = 'inca-ss-list max-h-56 overflow-y-auto divide-y divide-gray-50 py-0.5';
      this.list.setAttribute('role', 'listbox');
      this.dropdown.appendChild(this.list);

      // Pesan saat pencarian tidak ditemukan
      this.emptyBox = document.createElement('div');
      this.emptyBox.className = 'inca-ss-empty hidden p-4 text-center text-xs text-gray-500 select-none';
      this.emptyBox.innerHTML = `
        <div class="font-semibold text-gray-700">Tidak ada data yang cocok</div>
        <div class="text-[11px] text-gray-400 mt-0.5">Coba ketik kata kunci lain atau periksa ejaan</div>
      `;
      this.dropdown.appendChild(this.emptyBox);

      this.wrapper.appendChild(this.dropdown);
    }

    readOptions() {
      const opts = Array.from(this.select.options);
      this.allItems = opts.map((opt, idx) => {
        const metaValues = [];
        for (const [k, v] of Object.entries(opt.dataset || {})) {
          metaValues.push(String(v));
        }
        return {
          index: idx,
          value: opt.value,
          text: opt.textContent.trim(),
          disabled: opt.disabled,
          isEmptyOption: opt.value === '' || opt.textContent.trim().startsWith('--'),
          dataset: { ...opt.dataset },
          searchMeta: metaValues.join(' ')
        };
      });
      this.filteredItems = [...this.allItems];
    }

    interceptValueSetter() {
      const sel = this.select;
      const originalDescriptor = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
      if (!originalDescriptor) return;

      const self = this;
      Object.defineProperty(sel, 'value', {
        get() {
          return originalDescriptor.get.call(this);
        },
        set(val) {
          originalDescriptor.set.call(this, val);
          self.sync();
        },
        configurable: true
      });
    }

    observeMutations() {
      this.observer = new MutationObserver(() => {
        this.readOptions();
        this.sync();
      });
      this.observer.observe(this.select, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['disabled']
      });

      if (this.select.form) {
        this.select.form.addEventListener('reset', () => {
          setTimeout(() => {
            this.sync();
          }, 10);
        });
      }

      this.select.addEventListener('invalid', (e) => {
        e.preventDefault();
        this.control.classList.add('border-red-500', 'ring-2', 'ring-red-400');
        this.input.focus();
        this.open();
      });
    }

    bindEvents() {
      // Klik kontrol membuka / fokus ke input
      this.control.addEventListener('click', (e) => {
        if (e.target === this.clearBtn || this.clearBtn.contains(e.target)) return;
        if (e.target === this.arrowBtn || this.arrowBtn.contains(e.target)) {
          if (this.isOpen) {
            this.close();
          } else {
            this.open();
            this.input.focus();
            this.input.select();
          }
          return;
        }

        if (!this.isOpen) {
          this.open();
        }
        this.input.focus();
        this.input.select();
      });

      // Mengetik di input langsung memfilter opsi secara real-time
      this.input.addEventListener('input', () => {
        this._isUserInput = true;
        const q = this.input.value.trim();
        if (q.length > 0) {
          this.clearBtn.classList.remove('hidden');
        } else {
          this.clearBtn.classList.add('hidden');
        }

        if (!this.isOpen) {
          this.open();
        }
        this.filter(q);
      });

      // Fokus membuka dropdown
      this.input.addEventListener('focus', () => {
        if (!this.isOpen) {
          this.open();
        }
        this.input.select();
      });

      // Navigasi keyboard (ArrowDown, ArrowUp, Enter, Escape, Tab)
      this.input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (!this.isOpen) {
            this.open();
          } else {
            this.moveHighlight(1);
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (!this.isOpen) {
            this.open();
          } else {
            this.moveHighlight(-1);
          }
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (this.isOpen) {
            if (this.highlightedIndex >= 0 && this.highlightedIndex < this.filteredItems.length) {
              this.selectItem(this.filteredItems[this.highlightedIndex]);
            } else if (this.filteredItems.length === 1) {
              this.selectItem(this.filteredItems[0]);
            } else if (this.filteredItems.length > 0) {
              this.selectItem(this.filteredItems[0]);
            }
          }
        } else if (e.key === 'Escape') {
          e.preventDefault();
          this.close();
          this.sync();
        } else if (e.key === 'Tab') {
          this.close();
        }
      });

      // Tombol Hapus / Clear ✕
      this.clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.input.value = '';
        this.clearBtn.classList.add('hidden');
        this.filter('');
        this.input.focus();
      });

      // Tutup saat klik di luar
      document.addEventListener('pointerdown', (e) => {
        if (!this.wrapper.contains(e.target)) {
          if (this.isOpen) {
            this.close();
            this.sync();
          }
        }
      });
    }

    open() {
      if (this.select.disabled) return;

      // Tutup dropdown lain yang sedang terbuka
      activeInstances.forEach(inst => {
        if (inst !== this && inst.isOpen) {
          inst.close();
          inst.sync();
        }
      });

      this.isOpen = true;
      this.dropdown.classList.remove('hidden');
      this.arrowBtn.querySelector('svg')?.classList.add('rotate-180');
      this.control.classList.add('ring-2', 'ring-sage-500', 'border-sage-500');

      // Auto-flip ke atas bila dekat tepi bawah layar
      if (this.options.autoFlip) {
        const rect = this.control.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        if (spaceBelow < 220 && rect.top > 220) {
          this.dropdown.style.top = 'auto';
          this.dropdown.style.bottom = 'calc(100% + 4px)';
        } else {
          this.dropdown.style.bottom = 'auto';
          this.dropdown.style.top = 'calc(100% + 4px)';
        }
      }

      this.filter(this._isUserInput ? this.input.value.trim() : '');
    }

    close() {
      this.isOpen = false;
      this._isUserInput = false;
      this.dropdown.classList.add('hidden');
      this.arrowBtn.querySelector('svg')?.classList.remove('rotate-180');
      this.control.classList.remove('ring-2', 'ring-sage-500', 'border-sage-500');
      this.highlightedIndex = -1;
    }

    filter(query) {
      const q = (query || '').trim().toLowerCase();
      const tokens = q.split(/\s+/).filter(Boolean);

      if (tokens.length === 0) {
        this.filteredItems = [...this.allItems];
      } else {
        this.filteredItems = this.allItems.filter(item => {
          if (item.isEmptyOption) return false;
          const haystack = (item.text + ' ' + item.value + ' ' + item.searchMeta).toLowerCase();
          return tokens.every(tok => haystack.includes(tok));
        });
      }

      this.renderList(tokens);
    }

    renderList(tokens = []) {
      this.list.innerHTML = '';
      const countEl = this.headerBar.querySelector('.inca-ss-count');

      if (this.filteredItems.length === 0) {
        this.emptyBox.classList.remove('hidden');
        if (countEl) countEl.textContent = '0 data cocok';
        this.highlightedIndex = -1;
        return;
      }

      this.emptyBox.classList.add('hidden');
      if (countEl) {
        countEl.textContent = tokens.length > 0 
          ? `Ditemukan ${this.filteredItems.length} dari ${this.allItems.length} opsi`
          : `Menampilkan semua (${this.allItems.length} opsi)`;
      }

      const currentValue = this.select.value;

      this.filteredItems.forEach((item, idx) => {
        const div = document.createElement('div');
        div.className = 'inca-ss-item px-3 py-2 text-xs cursor-pointer flex items-center justify-between transition hover:bg-sage-50 text-gray-700';
        div.setAttribute('data-value', item.value);
        div.setAttribute('data-index', idx);

        const isSelected = item.value === currentValue && item.value !== '';
        if (isSelected) {
          div.classList.add('bg-emerald-50', 'text-emerald-900', 'font-semibold');
        }

        if (idx === this.highlightedIndex) {
          div.classList.add('bg-sage-100', 'text-sage-900');
        }

        // Highlight teks yang cocok
        let displayText = escapeHtml(item.text);
        if (tokens.length > 0 && !item.isEmptyOption) {
          tokens.forEach(tok => {
            const regex = new RegExp(`(${escapeRegex(tok)})`, 'gi');
            displayText = displayText.replace(regex, '<mark class="bg-amber-100 text-amber-900 px-0.5 rounded font-bold">$1</mark>');
          });
        }

        // Tampilkan badge kuota atau harga jika ada
        let badgeHtml = '';
        if (item.dataset && item.dataset.remaining !== undefined) {
          const rem = Number(item.dataset.remaining);
          badgeHtml = rem > 0
            ? `<span class="ml-2 px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800 flex-shrink-0">Sisa ${rem}</span>`
            : `<span class="ml-2 px-1.5 py-0.5 text-[10px] font-bold rounded bg-amber-100 text-amber-800 flex-shrink-0">Habis</span>`;
        } else if (item.dataset && item.dataset.price) {
          badgeHtml = `<span class="ml-2 px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-gray-100 text-gray-800 flex-shrink-0">Rp ${Number(item.dataset.price).toLocaleString('id-ID')}</span>`;
        }

        div.innerHTML = `
          <div class="flex items-center min-w-0 pr-2">
            <span class="truncate">${displayText}</span>
            ${badgeHtml}
          </div>
          ${isSelected ? '<span class="text-emerald-600 font-bold ml-1 text-sm flex-shrink-0">✓</span>' : ''}
        `;

        div.addEventListener('click', (e) => {
          e.stopPropagation();
          this.selectItem(item);
        });

        this.list.appendChild(div);
      });
    }

    moveHighlight(direction) {
      if (this.filteredItems.length === 0) return;
      this.highlightedIndex += direction;
      if (this.highlightedIndex < 0) {
        this.highlightedIndex = this.filteredItems.length - 1;
      } else if (this.highlightedIndex >= this.filteredItems.length) {
        this.highlightedIndex = 0;
      }

      const items = this.list.querySelectorAll('.inca-ss-item');
      items.forEach((el, idx) => {
        if (idx === this.highlightedIndex) {
          el.classList.add('bg-sage-100', 'text-sage-900', 'font-semibold');
          el.scrollIntoView({ block: 'nearest' });
        } else {
          el.classList.remove('bg-sage-100', 'text-sage-900', 'font-semibold');
        }
      });
    }

    selectItem(item) {
      if (!item) return;

      const originalDescriptor = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
      if (originalDescriptor) {
        originalDescriptor.set.call(this.select, item.value);
      } else {
        this.select.value = item.value;
      }

      this.control.classList.remove('border-red-500', 'ring-2', 'ring-red-400');
      this.select.setCustomValidity('');

      this.input.value = item.isEmptyOption ? '' : item.text;
      if (!item.isEmptyOption && item.value !== '') {
        this.clearBtn.classList.remove('hidden');
      } else {
        this.clearBtn.classList.add('hidden');
      }
      this.close();

      // Trigger change & input events agar inline onchange & handler aktif
      this.select.dispatchEvent(new Event('change', { bubbles: true }));
      this.select.dispatchEvent(new Event('input', { bubbles: true }));
    }

    sync() {
      if (!this.select) return;
      this.readOptions();

      const curVal = this.select.value;
      const currentOpt = this.allItems.find(it => it.value === curVal);

      if (currentOpt && !currentOpt.isEmptyOption) {
        this.input.value = currentOpt.text;
        this.clearBtn.classList.remove('hidden');
      } else {
        this.input.value = '';
        this.clearBtn.classList.add('hidden');
      }

      if (this.select.disabled) {
        this.input.disabled = true;
        this.control.classList.add('opacity-60', 'bg-gray-100', 'cursor-not-allowed');
      } else {
        this.input.disabled = false;
        this.control.classList.remove('opacity-60', 'bg-gray-100', 'cursor-not-allowed');
      }
    }
  }

  // Registrasi Global
  window.IncaSearchableSelect = IncaSearchableSelect;

  window.closeAllSearchableDropdowns = function() {
    activeInstances.forEach(inst => {
      if (inst.isOpen) {
        inst.close();
        inst.sync();
      }
    });
  };

  window.initSearchableSelect = function(elementOrId, options = {}) {
    const el = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;
    if (el) {
      return new IncaSearchableSelect(el, options);
    }
    return null;
  };

  window.syncSearchableSelect = function(elementOrId) {
    const el = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;
    if (el && el._incaSearchableSelect) {
      el._incaSearchableSelect.readOptions();
      el._incaSearchableSelect.sync();
    }
  };

  window.initAllStudioSearchableSelects = function() {
    // 15 dropdown data input & filter di modul Admin Studio
    const studioSelectIds = [
      'ppmMemberId',
      'ppmPackageId',
      'ppmPaymentMethod',
      'smClassId',
      'smCoachId',
      'enrollMemberSelect',
      'checkinScheduleSelect',
      'mmStatus',
      'pmCategory',
      'cmCategory',
      'cmLevel',
      'calendarFilterCoach',
      'calendarFilterClass',
      'filterAttendanceCoach',
      'filterAttendanceStatus'
    ];

    studioSelectIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        window.initSearchableSelect(el);
      }
    });

    // Otomatis cover jika ada select lain di Admin Studio atau Modal dialognya
    const query = '#mainStudioView select, #memberModal select, #purchaseModal select, #packageModal select, #classModal select, #scheduleModal select, #enrollMemberModal select, #scheduleDetailModal select';
    document.querySelectorAll(query).forEach(sel => {
      if (!sel._incaSearchableSelect) {
        window.initSearchableSelect(sel);
      }
    });
  };

})(window, document);
