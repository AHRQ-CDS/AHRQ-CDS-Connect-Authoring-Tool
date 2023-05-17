// Uses colors from the Atom One Light syntax highlighting theme: https://github.com/atom/one-light-syntax

const theme = {
  plain: {
    color: '#32333a',
    backgroundColor: '#f9f9f9'
  },
  styles: [
    {
      types: ['result'],
      style: {
        color: '#a41339'
      }
    },
    {
      types: ['datetime'],
      style: {
        color: '#c04c40'
      }
    },
    {
      types: ['comment'],
      style: {
        color: '#979797',
        fontStyle: 'italic'
      }
    },
    {
      types: ['string'],
      style: {
        color: '#a97818'
      }
    },
    {
      types: ['variable'],
      style: {
        color: '#65964b'
      }
    },
    {
      types: ['keyword'],
      style: {
        color: '#407ab2'
      }
    },
    {
      types: ['boolean'],
      style: {
        color: '#c04c40'
      }
    },
    {
      types: ['number'],
      style: {
        color: '#c04c40'
      }
    },
    {
      types: ['punctuation'],
      style: {
        color: '#32333a'
      }
    },
    {
      types: ['operator'],
      style: {
        color: '#32333a'
      }
    }
  ]
};

export default theme;
