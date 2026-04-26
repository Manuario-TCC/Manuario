export const customStyles = {
    control: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: 'transparent',
        borderColor: state.isFocused ? 'var(--color-primary)' : 'var(--color-card-border)',
        borderRadius: '0.75rem',
        minHeight: '3rem',
        height: '3.125rem',
        boxShadow: 'none',
        '&:hover': {
            borderColor: state.isFocused ? 'var(--color-primary)' : 'var(--color-card-border)',
        },
        cursor: 'pointer',
    }),

    valueContainer: (provided: any) => ({
        ...provided,
        height: '3rem',
        padding: '0 1rem',
    }),

    indicatorsContainer: (provided: any) => ({
        ...provided,
        height: '3rem',
    }),

    menu: (provided: any) => ({
        ...provided,
        backgroundColor: 'var(--color-card)',
        border: '1px solid var(--color-card-border)',
        borderRadius: '1rem',
        overflow: 'hidden',
        zIndex: 9999,
        marginTop: '4px',
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
        padding: '0.75rem 1rem',
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
        margin: 0,
        padding: 0,
    }),

    dropdownIndicator: (provided: any) => ({
        ...provided,
        color: 'var(--color-sub-text)',
        padding: '0 1rem',
        '&:hover': {
            color: 'var(--color-text)',
        },
    }),

    indicatorSeparator: () => ({
        display: 'none',
    }),
};
