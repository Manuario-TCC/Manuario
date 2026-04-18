export const customStyles = {
    control: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: 'transparent',
        borderColor: state.isFocused ? 'var(--color-primary)' : 'var(--color-card-border)',
        borderRadius: '0.75rem',
        padding: '0.125rem',
        boxShadow: 'none',
        '&:hover': {
            borderColor: state.isFocused ? 'var(--color-primary)' : 'var(--color-card-border)',
        },
        cursor: 'pointer',
    }),

    menu: (provided: any) => ({
        ...provided,
        backgroundColor: 'var(--color-card)',
        border: '1px solid var(--color-card-border)',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        zIndex: 9999,
    }),

    option: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isSelected
            ? 'var(--color-primary)'
            : state.isFocused
              ? 'var(--color-card-border)'
              : 'transparent',
        color: 'var(--color-text)',
        cursor: 'pointer',
        '&:active': {
            backgroundColor: 'var(--color-primary)',
        },
    }),

    singleValue: (provided: any) => ({
        ...provided,
        color: 'var(--color-text)',
    }),

    placeholder: (provided: any) => ({
        ...provided,
        color: 'var(--color-sub-text)',
    }),

    input: (provided: any) => ({
        ...provided,
        color: 'var(--color-text)',
    }),

    dropdownIndicator: (provided: any) => ({
        ...provided,
        color: 'var(--color-sub-text)',
        '&:hover': {
            color: 'var(--color-text)',
        },
    }),

    indicatorSeparator: () => ({
        display: 'none',
    }),
};
