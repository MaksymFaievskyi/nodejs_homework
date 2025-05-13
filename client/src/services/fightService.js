/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
import controls from '../constants/controls';

// Constants
const CRITICAL_HIT_COOLDOWN = 10000; // 10 seconds
const CRITICAL_HIT_MULTIPLIER = 2;
const DAMAGE_INDICATOR_DURATION = 1000; // The time of displaying the damage indicator

export function getHitPower(fighter) {
    const criticalHitChance = Math.random() + 1;
    return fighter.power * criticalHitChance;
}

export function getBlockPower(fighter) {
    const dodgeChance = Math.random() + 1;
    return fighter.defense * dodgeChance;
}

export function getDamage(attacker, defender) {
    const hitPower = getHitPower(attacker);
    const blockPower = getBlockPower(defender);
    return hitPower > blockPower ? hitPower - blockPower : 0;
}

export async function fight(firstFighter, secondFighter, { onDamage, onLog }) {
    return new Promise(resolve => {
        // Objects to track the state of fighters
        const fighters = {
            first: {
                fighter: firstFighter,
                initialHealth: firstFighter.health,
                currentHealth: firstFighter.health,
                isBlocking: false,
                criticalHitCooldown: false,
                lastCriticalHit: 0,
                criticalCombo: controls.PlayerOneCriticalHitCombination,
                attackKey: controls.PlayerOneAttack,
                blockKey: controls.PlayerOneBlock,
                healthBar: document.getElementById('left-fighter-indicator')
            },
            second: {
                fighter: secondFighter,
                initialHealth: secondFighter.health,
                currentHealth: secondFighter.health,
                isBlocking: false,
                criticalHitCooldown: false,
                lastCriticalHit: 0,
                criticalCombo: controls.PlayerTwoCriticalHitCombination,
                attackKey: controls.PlayerTwoAttack,
                blockKey: controls.PlayerTwoBlock,
                healthBar: document.getElementById('right-fighter-indicator')
            }
        };

        const log = [];

        const pressedKeys = new Set();

        // Handling keystrokes
        const handleKeyDown = event => {
            pressedKeys.add(event.code);

            // Update block status
            fighters.first.isBlocking = pressedKeys.has(fighters.first.blockKey);
            fighters.second.isBlocking = pressedKeys.has(fighters.second.blockKey);

            // Handling critical hits
            const firstCritical = attemptCriticalHit(fighters.first, fighters.second);
            const secondCritical = attemptCriticalHit(fighters.second, fighters.first);

            // Handling default attacks if there were no critical ones
            if (!firstCritical && pressedKeys.has(fighters.first.attackKey) && !fighters.first.isBlocking) {
                applyDamage(fighters.first, fighters.second);
            }

            if (!secondCritical && pressedKeys.has(fighters.second.attackKey) && !fighters.second.isBlocking) {
                applyDamage(fighters.second, fighters.first);
            }
        };

        // Key release handling
        const handleKeyUp = event => {
            pressedKeys.delete(event.code);

            // Updating the block status
            fighters.first.isBlocking = pressedKeys.has(fighters.first.blockKey);
            fighters.second.isBlocking = pressedKeys.has(fighters.second.blockKey);
        };

        // Update of the fighter health scale
        const updateHealthBar = fighter => {
            const healthPercent = (fighter.currentHealth / fighter.initialHealth) * 100;
            fighter.healthBar.style.width = `${healthPercent}%`;
        };

        // Show damage information
        const showDamageInfo = (defender, damage, isCritical) => {
            let damageText;
            let textColor;
            if (damage <= 0) {
                damageText = 'Missing!';
                textColor = '#ffffff';
            } else if (isCritical) {
                damageText = `Critical Hit -${damage.toFixed(1)} HP!`;
                textColor = '#ff0000';
            } else {
                damageText = `-${damage.toFixed(1)} HP`;
                textColor = '#ffffff';
            }
            defender.healthBar.style.color = textColor;
            defender.healthBar.textContent = damageText;

            // Clearing text after 1 second
            setTimeout(() => {
                if (defender.healthBar) {
                    defender.healthBar.textContent = '';
                }
            }, DAMAGE_INDICATOR_DURATION);
        };

        // End of the fight
        const endFight = winner => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            resolve(winner, log);
        };

        // Damage by one fighter to another
        const applyDamage = (attacker, defender, isCritical = false) => {
            if (defender.isBlocking && !isCritical) {
                log.push(`${defender.fighter.name} ухилився від удару ${attacker.fighter.name}`);
                onLog?.(`${defender.fighter.name} ухилився від удару ${attacker.fighter.name}`);
                return; // Damage is blocked
            }

            let damage;
            if (isCritical) {
                damage = CRITICAL_HIT_MULTIPLIER * attacker.fighter.power;
                log.push(`${attacker.fighter.name} завдав критичний удар ${defender.fighter.name} на ${damage.toFixed(2)} шкоди`);
                onLog?.(`${attacker.fighter.name} завдав критичний удар ${defender.fighter.name} на ${damage.toFixed(2)} шкоди`);
            } else {
                damage = getDamage(attacker.fighter, defender.fighter);
                log.push(`${attacker.fighter.name} завдав ${damage.toFixed(2)} шкоди ${defender.fighter.name}`);
                onLog?.(`${attacker.fighter.name} завдав ${damage.toFixed(2)} шкоди ${defender.fighter.name}`);
            }

            defender.currentHealth = Math.max(0, defender.currentHealth - damage);
            updateHealthBar(defender);

            // Show damage
            showDamageInfo(defender, damage, isCritical);

            // Checking if the fight is over
            if (defender.currentHealth <= 0) {
                log.push(`${attacker.fighter.name} переміг!`);
                onLog?.(`${attacker.fighter.name} переміг!`);
                endFight(attacker.fighter);
            }
        };

        // Critical hit combination check
        const isCriticalHitCombination = combination => {
            return combination.every(key => pressedKeys.has(key));
        };

        // Critical hit handling
        const attemptCriticalHit = (attacker, defender) => {
            const now = Date.now();

            // Critical hit capability check
            if (
                !attacker.criticalHitCooldown &&
                !attacker.isBlocking &&
                isCriticalHitCombination(attacker.criticalCombo)
            ) {
                applyDamage(attacker, defender, true);

                attacker.criticalHitCooldown = true;
                attacker.lastCriticalHit = now;

                setTimeout(() => {
                    attacker.criticalHitCooldown = false;
                }, CRITICAL_HIT_COOLDOWN);

                return true;
            }

            // Checking the end of cooldown
            if (attacker.criticalHitCooldown && now - attacker.lastCriticalHit >= CRITICAL_HIT_COOLDOWN) {
                attacker.criticalHitCooldown = false;
            }

            return false;
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        updateHealthBar(fighters.first);
        updateHealthBar(fighters.second);
    });
}
