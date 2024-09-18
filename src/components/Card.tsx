import React from "react";

type CardProps = {
    titleCard: string;
    valueCard: string;
}

const Card: React.FC<CardProps> = ({ titleCard, valueCard }) => {

    const numericValue = parseFloat(valueCard);

    if (!titleCard || !valueCard) {
        throw new Error("Título e valor não podem ser nulos.");
    }

    if (isNaN(numericValue) || numericValue < 0) {
        throw new Error("O valor do card deve ser um número válido maior ou igual a 0.");
    }

    return (
        <div style={styles.cardContainer}>
          <div style={styles.value}>{valueCard}</div>
          <div style={styles.title}>{titleCard}</div>
        </div>
      );

    };

    const styles = {
        cardContainer: {
          width: '100%',
          height: '100%',
          
          display: 'flex',
          flexDirection: 'column' as const,
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid #ccc',
          borderRadius: '10px',
          padding: '16px',
          boxSizing: 'border-box' as const,

          margin: '0 10px',
          backgroundColor: 'white',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },

        value: {
          fontSize: '48px',
          fontFamily: 'Inter, sans-serif',
          marginBottom: 'auto',
        },

        title: {
          fontSize: '18px',
          fontFamily: 'Inter, sans-serif',
          alignSelf: 'center'
        },
      };      
      
      export default Card;