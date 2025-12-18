import toastReducer, {hideToast, showToast} from '../../slices/toast';

describe('Toast Slice', () => {
  describe('Initial State', () => {
    it('should return the initial state', () => {
      const state = toastReducer(undefined, {type: 'unknown'});

      expect(state).toEqual({
        isVisible: false,
        message: '',
        title: '',
        type: 'success',
      });
    });

    it('should have isVisible as false by default', () => {
      const state = toastReducer(undefined, {type: 'unknown'});

      expect(state.isVisible).toBe(false);
    });

    it('should have empty message by default', () => {
      const state = toastReducer(undefined, {type: 'unknown'});

      expect(state.message).toBe('');
    });

    it('should have empty title by default', () => {
      const state = toastReducer(undefined, {type: 'unknown'});

      expect(state.title).toBe('');
    });

    it('should have success as default type', () => {
      const state = toastReducer(undefined, {type: 'unknown'});

      expect(state.type).toBe('success');
    });
  });

  describe('showToast Action', () => {
    it('should show toast with message and title', () => {
      const previousState = {
        isVisible: false,
        message: '',
        title: '',
        type: 'success',
      };

      const state = toastReducer(
        previousState,
        showToast({
          title: 'Success',
          message: 'Operation completed successfully',
          type: 'success',
        }),
      );

      expect(state.isVisible).toBe(true);
      expect(state.title).toBe('Success');
      expect(state.message).toBe('Operation completed successfully');
      expect(state.type).toBe('success');
    });

    it('should show success toast', () => {
      const previousState = {
        isVisible: false,
        message: '',
        title: '',
        type: 'success',
      };

      const state = toastReducer(
        previousState,
        showToast({
          title: 'Success',
          message: 'Success message',
          type: 'success',
        }),
      );

      expect(state.isVisible).toBe(true);
      expect(state.type).toBe('success');
      expect(state.message).toBe('Success message');
    });

    it('should show error toast', () => {
      const previousState = {
        isVisible: false,
        message: '',
        title: '',
        type: 'success',
      };

      const state = toastReducer(
        previousState,
        showToast({
          title: 'Error',
          message: 'An error occurred',
          type: 'error',
        }),
      );

      expect(state.isVisible).toBe(true);
      expect(state.type).toBe('error');
      expect(state.message).toBe('An error occurred');
    });

    it('should show warning toast', () => {
      const previousState = {
        isVisible: false,
        message: '',
        title: '',
        type: 'success',
      };

      const state = toastReducer(
        previousState,
        showToast({
          title: 'Warning',
          message: 'Warning message',
          type: 'warning',
        }),
      );

      expect(state.isVisible).toBe(true);
      expect(state.type).toBe('warning');
      expect(state.message).toBe('Warning message');
    });

    it('should default to success type when type is not provided', () => {
      const previousState = {
        isVisible: false,
        message: '',
        title: '',
        type: 'success',
      };

      const state = toastReducer(
        previousState,
        showToast({
          title: 'Info',
          message: 'Information message',
        }),
      );

      expect(state.isVisible).toBe(true);
      expect(state.type).toBe('success');
    });

    it('should handle empty title', () => {
      const previousState = {
        isVisible: false,
        message: '',
        title: '',
        type: 'success',
      };

      const state = toastReducer(
        previousState,
        showToast({
          title: '',
          message: 'Message without title',
          type: 'success',
        }),
      );

      expect(state.isVisible).toBe(true);
      expect(state.title).toBe('');
      expect(state.message).toBe('Message without title');
    });

    it('should handle empty message', () => {
      const previousState = {
        isVisible: false,
        message: '',
        title: '',
        type: 'success',
      };

      const state = toastReducer(
        previousState,
        showToast({
          title: 'Title',
          message: '',
          type: 'success',
        }),
      );

      expect(state.isVisible).toBe(true);
      expect(state.title).toBe('Title');
      expect(state.message).toBe('');
    });

    it('should override existing toast', () => {
      const previousState = {
        isVisible: true,
        message: 'Old message',
        title: 'Old title',
        type: 'success',
      };

      const state = toastReducer(
        previousState,
        showToast({
          title: 'New title',
          message: 'New message',
          type: 'error',
        }),
      );

      expect(state.isVisible).toBe(true);
      expect(state.title).toBe('New title');
      expect(state.message).toBe('New message');
      expect(state.type).toBe('error');
    });

    it('should handle long messages', () => {
      const longMessage =
        'This is a very long message that contains a lot of information about the operation that just completed successfully';

      const previousState = {
        isVisible: false,
        message: '',
        title: '',
        type: 'success',
      };

      const state = toastReducer(
        previousState,
        showToast({
          title: 'Info',
          message: longMessage,
          type: 'success',
        }),
      );

      expect(state.isVisible).toBe(true);
      expect(state.message).toBe(longMessage);
    });

    it('should handle special characters in message', () => {
      const messageWithSpecialChars = 'Error: <invalid> data & symbols!';

      const previousState = {
        isVisible: false,
        message: '',
        title: '',
        type: 'success',
      };

      const state = toastReducer(
        previousState,
        showToast({
          title: 'Error',
          message: messageWithSpecialChars,
          type: 'error',
        }),
      );

      expect(state.message).toBe(messageWithSpecialChars);
    });
  });

  describe('hideToast Action', () => {
    it('should hide toast and reset state', () => {
      const previousState = {
        isVisible: true,
        message: 'Test message',
        title: 'Test title',
        type: 'success',
      };

      const state = toastReducer(previousState, hideToast());

      expect(state.isVisible).toBe(false);
      expect(state.message).toBe('');
      expect(state.title).toBe('');
      expect(state.type).toBe('success');
    });

    it('should reset to initial state', () => {
      const previousState = {
        isVisible: true,
        message: 'Error occurred',
        title: 'Error',
        type: 'error',
      };

      const state = toastReducer(previousState, hideToast());

      expect(state).toEqual({
        isVisible: false,
        message: '',
        title: '',
        type: 'success',
      });
    });

    it('should work when toast is already hidden', () => {
      const previousState = {
        isVisible: false,
        message: '',
        title: '',
        type: 'success',
      };

      const state = toastReducer(previousState, hideToast());

      expect(state).toEqual({
        isVisible: false,
        message: '',
        title: '',
        type: 'success',
      });
    });

    it('should clear all toast data', () => {
      const previousState = {
        isVisible: true,
        message: 'Warning: Check your input',
        title: 'Warning',
        type: 'warning',
      };

      const state = toastReducer(previousState, hideToast());

      expect(state.isVisible).toBe(false);
      expect(state.message).toBe('');
      expect(state.title).toBe('');
      expect(state.type).toBe('success');
    });
  });

  describe('Action Creators', () => {
    it('should create showToast action with correct payload', () => {
      const payload = {
        title: 'Test',
        message: 'Test message',
        type: 'success',
      };

      const action = showToast(payload);

      expect(action.type).toBe('toast/showToast');
      expect(action.payload).toEqual(payload);
    });

    it('should create hideToast action without payload', () => {
      const action = hideToast();

      expect(action.type).toBe('toast/hideToast');
      expect(action.payload).toBeUndefined();
    });
  });

  describe('State Transitions', () => {
    it('should transition from hidden to visible', () => {
      let state = toastReducer(undefined, {type: 'unknown'});

      expect(state.isVisible).toBe(false);

      state = toastReducer(
        state,
        showToast({
          title: 'Hello',
          message: 'World',
          type: 'success',
        }),
      );

      expect(state.isVisible).toBe(true);
    });

    it('should transition from visible to hidden', () => {
      let state = toastReducer(
        undefined,
        showToast({
          title: 'Test',
          message: 'Test message',
          type: 'success',
        }),
      );

      expect(state.isVisible).toBe(true);

      state = toastReducer(state, hideToast());

      expect(state.isVisible).toBe(false);
    });

    it('should handle multiple show/hide cycles', () => {
      let state = toastReducer(undefined, {type: 'unknown'});

      // First show
      state = toastReducer(
        state,
        showToast({
          title: 'First',
          message: 'First message',
          type: 'success',
        }),
      );
      expect(state.isVisible).toBe(true);
      expect(state.message).toBe('First message');

      // Hide
      state = toastReducer(state, hideToast());
      expect(state.isVisible).toBe(false);

      // Second show
      state = toastReducer(
        state,
        showToast({
          title: 'Second',
          message: 'Second message',
          type: 'error',
        }),
      );
      expect(state.isVisible).toBe(true);
      expect(state.message).toBe('Second message');
      expect(state.type).toBe('error');

      // Hide again
      state = toastReducer(state, hideToast());
      expect(state.isVisible).toBe(false);
    });

    it('should handle rapid show calls', () => {
      let state = toastReducer(undefined, {type: 'unknown'});

      state = toastReducer(
        state,
        showToast({
          title: 'First',
          message: 'First',
          type: 'success',
        }),
      );

      state = toastReducer(
        state,
        showToast({
          title: 'Second',
          message: 'Second',
          type: 'error',
        }),
      );

      state = toastReducer(
        state,
        showToast({
          title: 'Third',
          message: 'Third',
          type: 'warning',
        }),
      );

      expect(state.isVisible).toBe(true);
      expect(state.title).toBe('Third');
      expect(state.message).toBe('Third');
      expect(state.type).toBe('warning');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined payload properties', () => {
      const previousState = {
        isVisible: false,
        message: '',
        title: '',
        type: 'success',
      };

      const state = toastReducer(
        previousState,
        showToast({
          title: undefined,
          message: undefined,
          type: undefined,
        } as any),
      );

      expect(state.isVisible).toBe(true);
      expect(state.title).toBeUndefined();
      expect(state.message).toBeUndefined();
      expect(state.type).toBe('success'); // Defaults to success
    });

    it('should handle null values', () => {
      const previousState = {
        isVisible: false,
        message: '',
        title: '',
        type: 'success',
      };

      const state = toastReducer(
        previousState,
        showToast({
          title: null,
          message: null,
          type: null,
        } as any),
      );

      expect(state.isVisible).toBe(true);
      expect(state.type).toBe('success'); // Defaults to success when null
    });

    it('should handle empty payload', () => {
      const previousState = {
        isVisible: false,
        message: '',
        title: '',
        type: 'success',
      };

      const state = toastReducer(previousState, showToast({} as any));

      expect(state.isVisible).toBe(true);
      expect(state.type).toBe('success');
    });
  });

  describe('Type Safety', () => {
    it('should maintain type for success', () => {
      const state = toastReducer(
        undefined,
        showToast({
          title: 'Success',
          message: 'Success',
          type: 'success',
        }),
      );

      expect(state.type).toBe('success');
    });

    it('should maintain type for error', () => {
      const state = toastReducer(
        undefined,
        showToast({
          title: 'Error',
          message: 'Error',
          type: 'error',
        }),
      );

      expect(state.type).toBe('error');
    });

    it('should maintain type for warning', () => {
      const state = toastReducer(
        undefined,
        showToast({
          title: 'Warning',
          message: 'Warning',
          type: 'warning',
        }),
      );

      expect(state.type).toBe('warning');
    });
  });

  describe('Immutability', () => {
    it('should not mutate original state on showToast', () => {
      const previousState = {
        isVisible: false,
        message: '',
        title: '',
        type: 'success' as const,
      };

      const originalState = {...previousState};

      toastReducer(
        previousState,
        showToast({
          title: 'Test',
          message: 'Test',
          type: 'success',
        }),
      );

      expect(previousState).toEqual(originalState);
    });

    it('should not mutate original state on hideToast', () => {
      const previousState = {
        isVisible: true,
        message: 'Test',
        title: 'Test',
        type: 'success' as const,
      };

      const originalState = {...previousState};

      toastReducer(previousState, hideToast());

      expect(previousState).toEqual(originalState);
    });
  });
});
