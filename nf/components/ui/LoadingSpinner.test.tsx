import { render, screen } from '@testing-library/react';
import LoadingSpinner, { FullPageLoader, CardLoader, ListLoader } from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('affiche le texte de chargement par défaut', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  it('affiche un texte personnalisé', () => {
    render(<LoadingSpinner text="Chargement des données..." />);
    expect(screen.getByText('Chargement des données...')).toBeInTheDocument();
  });

  it('n\'affiche pas de texte quand text est vide', () => {
    render(<LoadingSpinner text="" />);
    expect(screen.queryByText('Chargement...')).not.toBeInTheDocument();
  });

  it('applique la classe CSS personnalisée', () => {
    const { container } = render(<LoadingSpinner className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('contient une icône de chargement', () => {
    const { container } = render(<LoadingSpinner />);
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('animate-spin');
  });

  describe('tailles', () => {
    it('utilise la taille md par défaut', () => {
      const { container } = render(<LoadingSpinner />);
      const icon = container.querySelector('svg');
      expect(icon).toHaveClass('w-6', 'h-6');
    });

    it('utilise la taille sm', () => {
      const { container } = render(<LoadingSpinner size="sm" />);
      const icon = container.querySelector('svg');
      expect(icon).toHaveClass('w-4', 'h-4');
    });

    it('utilise la taille lg', () => {
      const { container } = render(<LoadingSpinner size="lg" />);
      const icon = container.querySelector('svg');
      expect(icon).toHaveClass('w-8', 'h-8');
    });
  });
});

describe('FullPageLoader', () => {
  it('affiche le texte par défaut', () => {
    render(<FullPageLoader />);
    expect(screen.getByText('Chargement de la page...')).toBeInTheDocument();
    expect(screen.getByText('Veuillez patienter...')).toBeInTheDocument();
  });

  it('affiche un texte personnalisé', () => {
    render(<FullPageLoader text="Chargement du dashboard..." />);
    expect(screen.getByText('Chargement du dashboard...')).toBeInTheDocument();
  });

  it('a la classe min-h-screen pour occuper toute la hauteur', () => {
    const { container } = render(<FullPageLoader />);
    expect(container.firstChild).toHaveClass('min-h-screen');
  });
});

describe('CardLoader', () => {
  it('affiche un squelette de carte', () => {
    const { container } = render(<CardLoader />);
    expect(container.firstChild).toHaveClass('card');
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('applique une classe personnalisée', () => {
    const { container } = render(<CardLoader className="custom-card" />);
    expect(container.firstChild).toHaveClass('custom-card');
  });
});

describe('ListLoader', () => {
  it('affiche 3 éléments par défaut', () => {
    const { container } = render(<ListLoader />);
    const items = container.querySelectorAll('.flex.items-center');
    expect(items).toHaveLength(3);
  });

  it('affiche le nombre d\'éléments spécifié', () => {
    const { container } = render(<ListLoader items={5} />);
    const items = container.querySelectorAll('.flex.items-center');
    expect(items).toHaveLength(5);
  });

  it('applique une classe personnalisée', () => {
    const { container } = render(<ListLoader className="custom-list" />);
    expect(container.firstChild).toHaveClass('custom-list');
  });

  it('chaque élément a un avatar et du contenu', () => {
    const { container } = render(<ListLoader items={2} />);
    const avatars = container.querySelectorAll('.w-12.h-12');
    const contents = container.querySelectorAll('.flex-1');
    expect(avatars).toHaveLength(2);
    expect(contents).toHaveLength(2);
  });
});

