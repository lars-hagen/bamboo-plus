// ==UserScript==
// @name         BambooHR Plus
// @namespace    https://github.com/lars-hagen/bamboo-plus
// @version      1.0.0-dev.15-dev.20250114.193036.fc81e52
// @description  Enhanced BambooHR experience with improved UI and smart features
// @author       Lars Hagen
// @match        https://*.bamboohr.com/employees/timesheet/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const SELECTORS = {
        ROW: '.TimesheetSlat',
        INPUT: '.TimesheetSlat__input',
        DAY: '.TimesheetSlat__dayOfWeek',
        HOLIDAY: 'svg path[d*="M231.9 44.4C215.7 16.9 186.1 0 154.2 0H152C103.4 0 64 39.4 64 88c0 14.4"]',
        INFO: '.TimesheetSlat__extraInfo',
        OVERTIME: '.TimesheetSlat__noteIconWrapper--hasHours',
        FOOTER: '#siteFooter',
        SIDENAV: '.SideNav',
        COLUMN: '.infoColumn'
    };

    const settings = {
        ...{ defaultHours: 7.5, skipHolidays: true, skipVacation: true, showFooterImmediately: true },
        ...JSON.parse(localStorage.getItem('bamboohr_autofill_settings') || '{}')
    };

    const icons = {
        autofill: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-8.414V6a1 1 0 10-2 0v4c0 .265.105.52.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586z" fill="currentColor"/></svg>',
        settings: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.853c-1.372-.836-2.942.734-2.106 2.106.213.35.274.786.145 1.186-.13.4-.432.725-.82.912-1.56.38-1.56 2.6 0 2.98a1.532 1.532 0 01.675 2.498c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.498.675c.38 1.56 2.6 1.56 2.98 0a1.532 1.532 0 012.498-.675c1.372.836 2.942-.734 2.106-2.106a1.532 1.532 0 01.675-2.498c1.56-.38 1.56-2.6 0-2.98a1.532 1.532 0 01-.675-2.498c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.498-.675zM10 13a3 3 0 100-6 3 3 0 000 6z" fill="currentColor"/></svg>',
        close: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
    };

    const container = document.createElement('div');
    container.style.cssText = `
        position: sticky; bottom: 12px; margin-top: auto;
        background: white; border: 1px solid #e5e7eb;
        border-radius: 8px; padding: 8px;
        display: flex; justify-content: flex-start;
        z-index: 99; box-shadow: 0 3px 8px rgba(0,0,0,0.08);
        width: calc(100% - 16px); transition: all 0.2s ease-out;
    `;

    const buttonWrapper = document.createElement('div');
    buttonWrapper.style.cssText = 'width: 100%; display: flex; flex-direction: column; gap: 3px;';

    const createButton = (primary, text, icon) => `
        <button class="fab-Button fab-Button--${primary ? 'primary' : 'secondary'}" 
            style="width: 100%; justify-content: center; padding: 12px 16px; font-weight: 500;${!primary ? ' color: #666;' : ''}">
            <span class="fab-Button__text" style="display: flex; align-items: center; gap: 8px; justify-content: center;">
                ${icon}<span>${text}</span>
            </span>
        </button>`;

    const settingsPanel = document.createElement('div');
    settingsPanel.style.cssText = 'height: 0; overflow: hidden; transition: height 0.2s ease-out; margin: 0; opacity: 0;';
    settingsPanel.innerHTML = `
        <div style="padding: 8px 0;">
            <div style="padding: 0 16px; margin: 0 -8px 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; flex-direction: column; gap: 1px;">
                        <div style="font-size: 14px; color: #111827; font-weight: 500; line-height: 20px;">Default Hours</div>
                        <div style="font-size: 11px; color: #666; line-height: 14px;">per workday</div>
                    </div>
                    <input type="number" class="TimesheetSlat__input fab-TextInput fab-TextInput--biggie" id="defaultHours" 
                        value="${settings.defaultHours}" step="0.5" min="0" max="24" style="width: 56px; text-align: center;">
                </div>
            </div>
            <div style="background: #f5f7f9; border-radius: 6px; padding: 12px 16px; margin: 0 -8px 12px;">
                <div class="fab-CheckboxGroup">
                    ${['skipHolidays', 'skipVacation'].map(id => `
                        <div class="fab-Checkbox">
                            <input class="fab-Checkbox__input" id="${id}" type="checkbox" ${settings[id] ? 'checked' : ''}>
                            <label class="fab-Checkbox__label" for="${id}" style="line-height: 20px;">
                                ${id === 'skipHolidays' ? 'Skip Holidays' : 'Skip Vacation Days'}
                            </label>
                            <div style="color: #666; font-size: 13px; margin: 2px 0 0 24px;">
                                Don't fill hours on ${id === 'skipHolidays' ? 'holiday' : 'vacation'} days
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="fab-Checkbox" style="padding: 0 16px 12px; margin: 0 -8px;">
                <input class="fab-Checkbox__input" id="showFooterImmediately" type="checkbox" ${settings.showFooterImmediately ? 'checked' : ''}>
                <label class="fab-Checkbox__label" for="showFooterImmediately" style="line-height: 20px;">Show Controls Immediately</label>
            </div>
        </div>`;

    buttonWrapper.innerHTML = createButton(true, `Autofill Empty ${settings.defaultHours}h`, icons.autofill);
    buttonWrapper.appendChild(settingsPanel);
    buttonWrapper.insertAdjacentHTML('beforeend', createButton(false, 'Settings', icons.settings));
    container.appendChild(buttonWrapper);

    const updatePosition = () => {
        const footerHeight = document.querySelector(SELECTORS.FOOTER)?.offsetHeight || 0;
        container.style.bottom = `${footerHeight + 12}px`;
        container.style.left = document.querySelector(`${SELECTORS.SIDENAV}--collapsed`) ? '64px' : '240px';
    };

    new MutationObserver(updatePosition).observe(document.documentElement, {
        attributes: true,
        subtree: true,
        attributeFilter: ['class']
    });

    let isSettingsOpen = false;
    container.querySelector('.fab-Button--secondary').onclick = (e) => {
        isSettingsOpen = !isSettingsOpen;
        settingsPanel.style.height = isSettingsOpen ? `${settingsPanel.scrollHeight}px` : '0';
        settingsPanel.style.opacity = isSettingsOpen ? '1' : '0';
        e.currentTarget.querySelector('.fab-Button__text').innerHTML = `
            <span style="display: flex; align-items: center; gap: 8px; justify-content: center;">
                ${isSettingsOpen ? icons.close : icons.settings}
                ${isSettingsOpen ? 'Close Settings' : 'Settings'}
            </span>`;
    };

    settingsPanel.addEventListener('change', () => {
        const newSettings = {
            defaultHours: parseFloat(settingsPanel.querySelector('#defaultHours').value),
            skipHolidays: settingsPanel.querySelector('#skipHolidays').checked,
            skipVacation: settingsPanel.querySelector('#skipVacation').checked,
            showFooterImmediately: settingsPanel.querySelector('#showFooterImmediately').checked
        };
        Object.assign(settings, newSettings);
        localStorage.setItem('bamboohr_autofill_settings', JSON.stringify(settings));
        container.querySelector('.fab-Button--primary .fab-Button__text span:last-child').textContent = 
            `Autofill Empty ${settings.defaultHours}h`;
        container.style.display = settings.showFooterImmediately ? 'flex' : 'none';
    });

    document.addEventListener('focusin', (e) => {
        if (e.target.matches('.TimesheetSlat__input') && !settings.showFooterImmediately) {
            container.style.display = 'flex';
        }
    });

    const simulateReactChange = async (input, value) => {
        input.value = value;
        
        // Try multiple methods to update the input
        const methods = [
            // Method 1: React Fiber (current)
            () => {
                const fiber = Object.entries(input).find(([k]) => k.startsWith('__reactFiber$'))?.[1];
                if (!fiber?.memoizedProps) return false;
                
                const { onChange, onFocus, onBlur } = fiber.memoizedProps;
                const event = { target: input, currentTarget: input, type: 'change', bubbles: true,
                    preventDefault: () => {}, stopPropagation: () => {}, persist: () => {} };
                
                onFocus?.(event);
                onChange?.(event);
                onBlur?.(event);
                return true;
            },
            // Method 2: React internal instance
            () => {
                const key = Object.keys(input).find(k => k.startsWith('__reactInternalInstance$'));
                const internal = input[key];
                if (!internal?.return?.stateNode?.props?.onChange) return false;
                
                internal.return.stateNode.props.onChange({ target: input });
                return true;
            }
        ];

        // Try each method until one works
        for (const method of methods) {
            if (method()) break;
        }

        // Ensure DOM is updated
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')
            .set.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
    };

    container.querySelector('.fab-Button--primary').onclick = async () => {
        const slots = document.querySelectorAll(SELECTORS.ROW);
        for (const slot of slots) {
            const input = slot.querySelector(SELECTORS.INPUT);
            if (!input || input.disabled || input.value.trim()) continue;

            const dayLabel = slot.querySelector(SELECTORS.DAY)?.textContent;
            if (dayLabel?.match(/^(Sat|Sun)$/)) continue;

            const hasOvertime = slot.querySelector(SELECTORS.OVERTIME);
            if (hasOvertime) continue;

            const isHoliday = slot.querySelector(SELECTORS.HOLIDAY);
            const isVacation = slot.querySelector(SELECTORS.INFO)?.textContent.toLowerCase().includes('vacation');
            
            if (settings.skipHolidays && isHoliday) continue;
            if (settings.skipVacation && isVacation) continue;

            await simulateReactChange(input, settings.defaultHours.toString());
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    };

    document.querySelector(SELECTORS.COLUMN)?.appendChild(container);
    container.style.display = settings.showFooterImmediately ? 'flex' : 'none';
    updatePosition();
})(); 