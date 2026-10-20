import {
	describe,
	it,
	expect,
	beforeEach,
	afterEach,
	vi,
} from 'vitest';

import Gyros from './main.js';

describe('Gyros', () => {
	beforeEach(() => {
		document.body.innerHTML = '<div class="gyros-element"></div>';
	});

	it('should create an instance with default options', () => {
		const gyros = new Gyros('.gyros-element');
		expect(gyros.options.material).toBe('gold');
		expect(gyros.options.shininess).toBe('polished');
		expect(gyros.options.sensitivity).toBe(50);
		expect(gyros.options.fallback).toEqual(['gyroscope', 'mouse', 'static']);
	});

	it('should accept custom options', () => {
		const gyros = new Gyros('.gyros-element', {material: 'silver', shininess: 'matte'});
		expect(gyros.options.material).toBe('silver');
		expect(gyros.options.shininess).toBe('matte');
	});

	it('should select elements by selector', () => {
		const gyros = new Gyros('.gyros-element');
		expect(gyros.elements.length).toBe(1);
	});

	it('should generate a gradient string', () => {
		const gyros = new Gyros('.gyros-element');
		const gradient = gyros.getGradient(45, 45);
		expect(gradient).toContain('linear-gradient');
		expect(gradient).toContain('deg');
	});

	it('should use default gradient for undefined inputs', () => {
		const gyros = new Gyros('.gyros-element');
		const gradient = gyros.getGradient();
		expect(gradient).toContain('linear-gradient');
	});

	it('should handle predefined gold material', () => {
		const gyros = new Gyros('.gyros-element', {material: 'gold', shininess: 'polished'});
		const gradient = gyros.getGradient(0, 0);
		expect(gradient).toContain('#ffd700');
	});

	it('should handle predefined silver material', () => {
		const gyros = new Gyros('.gyros-element', {material: 'silver', shininess: 'matte'});
		const gradient = gyros.getGradient(0, 0);
		expect(gradient).toContain('#737373');
	});

	it('should handle custom material object', () => {
		const customMaterial = {
			polished: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'],
		};
		const gyros = new Gyros('.gyros-element', {material: customMaterial});
		const gradient = gyros.getGradient(0, 0);
		expect(gradient).toContain('#ff0000');
	});

	it('should fall back to gold polished for unknown material', () => {
		const gyros = new Gyros('.gyros-element', {material: 'unknown'});
		const gradient = gyros.getGradient(0, 0);
		expect(gradient).toContain('#ffd700');
	});

	it('should handle mouse move events', () => {
		const gyros = new Gyros('.gyros-element');
		const element = document.querySelector('.gyros-element');

		gyros.handleMouseMove({clientX: 500, clientY: 300});

		expect(element.style.backgroundImage).toContain('linear-gradient');
	});

	it('should throttle updates based on sensitivity', () => {
		const gyros = new Gyros('.gyros-element', {sensitivity: 1000});
		const element = document.querySelector('.gyros-element');

		gyros.handleUpdate(10, 10);
		const first = element.style.backgroundImage;

		gyros.handleUpdate(20, 20);
		const second = element.style.backgroundImage;

		// Second update should be throttled (same as first)
		expect(second).toBe(first);
	});

	it('should handle orientation events', () => {
		const gyros = new Gyros('.gyros-element');
		const spy = vi.spyOn(gyros, 'handleUpdate');

		gyros.handleOrientation({beta: 45, gamma: 30});

		expect(spy).toHaveBeenCalledWith(45, 30);
	});

	describe('static fallback', () => {
		// Browsers normalise style values, so compare against what the same value looks like once set
		const normalise = gradient => {
			const probe = document.createElement('div');
			probe.style.backgroundImage = gradient;
			return probe.style.backgroundImage;
		};

		const settle = async () => new Promise(resolve => {
			setTimeout(resolve, 0);
		});

		const getBackground = () => document.querySelector('.gyros-element').style.backgroundImage;

		afterEach(() => {
			vi.unstubAllGlobals();
			vi.restoreAllMocks();
		});

		it('should apply the static gradient immediately with default options', () => {
			const gyros = new Gyros('.gyros-element');

			expect(getBackground()).not.toBe('');
			expect(getBackground()).toBe(normalise(gyros.getGradient()));
		});

		it('should apply the static gradient to every matching element', () => {
			document.body.innerHTML = '<div class="gyros-element"></div><div class="gyros-element"></div>';
			const gyros = new Gyros('.gyros-element');

			for (const element of document.querySelectorAll('.gyros-element')) {
				expect(element.style.backgroundImage).toBe(normalise(gyros.getGradient()));
			}
		});

		it('should apply the static gradient even if static is not in the fallback list', () => {
			const gyros = new Gyros('.gyros-element', {fallback: []});

			expect(getBackground()).toBe(normalise(gyros.getGradient()));
		});

		it('should apply the static gradient when DeviceOrientationEvent exists without requestPermission', async () => {
			vi.stubGlobal('DeviceOrientationEvent', class {});
			const gyros = new Gyros('.gyros-element');

			expect(getBackground()).toBe(normalise(gyros.getGradient()));
			await settle();
			expect(getBackground()).toBe(normalise(gyros.getGradient()));
		});

		it('should apply the static gradient before requestPermission resolves', async () => {
			const {promise, resolve: resolvePermission} = Promise.withResolvers();
			vi.stubGlobal('DeviceOrientationEvent', {requestPermission: async () => promise});
			const gyros = new Gyros('.gyros-element');

			expect(getBackground()).toBe(normalise(gyros.getGradient()));

			resolvePermission('granted');
			await settle();
			expect(getBackground()).toBe(normalise(gyros.getGradient()));
		});

		it('should keep the static gradient when permission is denied', async () => {
			vi.stubGlobal('DeviceOrientationEvent', {requestPermission: async () => 'denied'});
			const gyros = new Gyros('.gyros-element');

			expect(getBackground()).toBe(normalise(gyros.getGradient()));
			await settle();
			expect(getBackground()).toBe(normalise(gyros.getGradient()));
		});

		it('should keep the static gradient when requesting permission throws', async () => {
			vi.spyOn(console, 'error').mockImplementation(() => {});
			vi.stubGlobal('DeviceOrientationEvent', {
				requestPermission() {
					throw new Error('NotAllowedError');
				},
			});
			const gyros = new Gyros('.gyros-element');

			expect(getBackground()).toBe(normalise(gyros.getGradient()));
			await settle();
			expect(getBackground()).toBe(normalise(gyros.getGradient()));
			expect(console.error).toHaveBeenCalledOnce();
		});

		it('should replace the static gradient after a mousemove event', async () => {
			// JSDOM ships DeviceOrientationEvent, which would take the gyroscope path instead
			vi.stubGlobal('DeviceOrientationEvent', undefined);
			const gyros = new Gyros('.gyros-element');
			await settle();
			const staticGradient = getBackground();

			dispatchEvent(new MouseEvent('mousemove', {clientX: 10, clientY: 10}));

			expect(getBackground()).not.toBe('');
			expect(getBackground()).not.toBe(staticGradient);
			expect(getBackground()).toBe(normalise(gyros.getGradient(
				((10 / innerHeight) * 180) - 90,
				((10 / innerWidth) * 180) - 90,
			)));
		});

		it('should replace the static gradient after a deviceorientation event', async () => {
			vi.stubGlobal('DeviceOrientationEvent', class {});
			const gyros = new Gyros('.gyros-element');
			await settle();
			const staticGradient = getBackground();

			const event = new Event('deviceorientation');
			event.beta = 10;
			event.gamma = 20;
			dispatchEvent(event);

			expect(getBackground()).not.toBe(staticGradient);
			expect(getBackground()).toBe(normalise(gyros.getGradient(10, 20)));
		});

		it('should not throw when no elements match', async () => {
			expect(() => new Gyros('.does-not-exist')).not.toThrow();

			const gyros = new Gyros('.does-not-exist');
			await settle();
			expect(gyros.elements.length).toBe(0);
		});
	});
});
