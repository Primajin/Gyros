import {
	describe, it, expect, beforeEach, vi,
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
});
