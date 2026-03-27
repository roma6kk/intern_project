import { render, screen } from '@testing-library/react';
import type { AnchorHTMLAttributes, ImgHTMLAttributes, ReactNode } from 'react';
import '@testing-library/jest-dom';
import NotificationToast from './NotificationToast';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: (props: { href: string; children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const { href, children, ...rest } = props;
    return (
       
      <a href={href} {...rest}>
        {children}
      </a>
    );
  },
}));

describe('NotificationToast', () => {
  const mockActor = {
    username: 'test_user',
    avatarUrl: 'http://example.com/avatar.jpg',
  };

  it('should render "liked your post" for LIKE type', () => {
    render(
      <NotificationToast 
        type="LIKE" 
        actor={mockActor} 
        itemId="post-123" 
      />
    );

    expect(screen.getByText('test_user')).toBeInTheDocument();
    expect(screen.getByText('лайкнул ваш пост')).toBeInTheDocument();
  });

  it('should render "started following you" for FOLLOW type', () => {
    render(
      <NotificationToast 
        type="FOLLOW" 
        actor={mockActor} 
      />
    );

    expect(screen.getByText('подписался на вас')).toBeInTheDocument();
  });

  it('should render user avatar', () => {
    render(
      <NotificationToast 
        type="LIKE" 
        actor={mockActor} 
        itemId="post-123" 
      />
    );

    const img = screen.getByAltText('test_user');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockActor.avatarUrl);
  });
});