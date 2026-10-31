import { describe, it, expect } from 'vitest';
import { ALL_MODULES, QUICK_FORMULAS, STUDENT_NOTE_METADATA } from '@/data/curriculumData';
import { MODULE_QUIZ_REGISTRY } from '@/data/quizDatabase';

describe('Curriculum Data Integrity', () => {
  it('should define the complete course metadata', () => {
    expect(STUDENT_NOTE_METADATA.course_code).toBe('AIDS 12605.1');
    expect(STUDENT_NOTE_METADATA.title).toContain('Medical Image Processing');
  });

  it('should have 6 modules defined with valid properties', () => {
    expect(ALL_MODULES.length).toBe(6);

    ALL_MODULES.forEach((mod, index) => {
      expect(mod.module_number).toBe(index + 1);
      expect(mod.id).toBe(`mod-${index + 1}`);
      expect(mod.title).toBeTruthy();
      expect(mod.description).toBeTruthy();
      expect(mod.topics.length).toBeGreaterThan(0);
      expect(mod.topics_count).toBe(mod.topics.length);

      // Verify each topic within the module
      mod.topics.forEach((topic) => {
        expect(topic.id).toBeTruthy();
        expect(topic.slug).toBeTruthy();
        expect(topic.title).toBeTruthy();
        expect(topic.read_time_minutes).toBeGreaterThan(0);
      });
    });
  });

  it('should provide quick reference formulas with names and expressions', () => {
    expect(QUICK_FORMULAS.length).toBeGreaterThan(5);
    QUICK_FORMULAS.forEach((item) => {
      expect(item.name).toBeTruthy();
      expect(item.formula).toBeTruthy();
      expect(item.notes).toBeTruthy();
    });
  });
});

describe('Quiz Database Integrity', () => {
  it('should contain questions for each module in the registry', () => {
    const moduleKeys = Object.keys(MODULE_QUIZ_REGISTRY);
    expect(moduleKeys.length).toBeGreaterThanOrEqual(6);

    for (const [moduleId, questions] of Object.entries(MODULE_QUIZ_REGISTRY)) {
      expect(questions.length).toBeGreaterThan(0);

      questions.forEach((q) => {
        expect(q.id).toBeTruthy();
        expect(q.moduleId).toBe(moduleId);
        expect(q.question_text.trim()).toBeTruthy();
        expect(q.options.length).toBe(4);

        const optionIds = q.options.map((opt) => opt.id);
        expect(optionIds).toContain(q.correct_option_id);
        expect(q.explanation.trim()).toBeTruthy();

        // Check options text
        q.options.forEach((opt) => {
          expect(opt.text.trim()).toBeTruthy();
        });
      });
    }
  });
});
