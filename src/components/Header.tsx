import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import type { RootState, AppDispatch } from '../store/store';

const StyledHeader = styled.header`
  background-color: #ffffff;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 16px;

  @media (max-width: 768px) {
    padding: 8px 16px;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: bold;
  color: #E30613;
  text-decoration: none;
  white-space: nowrap;

  @media (max-width: 640px) {
    font-size: 20px;
  }
`;

const Nav = styled.nav<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 24px;

  @media (max-width: 768px) {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    background-color: #ffffff;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
    gap: 0;
    transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(-100%)')};
    transition: transform 0.3s ease-in-out;
    z-index: 99;
  }
`;

const NavLink = styled(Link)`
  color: #374151;
  text-decoration: none;
  transition: color 0.2s;
  white-space: nowrap;

  &:hover {
    color: #E30613;
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    border-bottom: 1px solid #e5e7eb;

    &:last-child {
      border-bottom: none;
    }
  }
`;

const CartLink = styled(NavLink)`
  position: relative;
`;

const CartBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #E30613;
  color: #ffffff;
  font-size: 12px;
  border-radius: 9999px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    gap: 8px;
  }
`;

const LogoutButton = styled.button`
  background-color: #E30613;
  color: #ffffff;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;

  &:hover {
    background-color: #C10510;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SignUpButton = styled(Link)`
  background-color: #E30613;
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  transition: background-color 0.2s;
  white-space: nowrap;

  &:hover {
    background-color: #C10510;
  }

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
  }
`;

const MenuToggle = styled.button`
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;

  @media (max-width: 768px) {
    display: flex;
  }

  span {
    width: 25px;
    height: 3px;
    background-color: #374151;
    border-radius: 2px;
    transition: all 0.3s ease;
  }
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 98;
  }
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    closeMenu();
  };

  return (
    <StyledHeader>
      <HeaderContainer>
        <HeaderContent>
          <Logo to="/" onClick={closeMenu}>Bosta Store</Logo>

          <MenuToggle onClick={toggleMenu} aria-label="Toggle menu">
            <span style={{ transform: isMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ opacity: isMenuOpen ? 0 : 1 }} />
            <span style={{ transform: isMenuOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none' }} />
          </MenuToggle>

          <Nav $isOpen={isMenuOpen}>
            <NavLink to="/" onClick={closeMenu}>Products</NavLink>
            {isAuthenticated && (
              <NavLink to="/create-product" onClick={closeMenu}>Create Product</NavLink>
            )}
            <CartLink to="/cart" onClick={closeMenu}>
              Cart
              {cartCount > 0 && <CartBadge>{cartCount}</CartBadge>}
            </CartLink>

            {isAuthenticated && user ? (
              <UserSection>
                <span className="text-gray-700">Hello, {user.username}</span>
                <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
              </UserSection>
            ) : (
              <UserSection>
                <NavLink to="/login" onClick={closeMenu}>Login</NavLink>
                <SignUpButton to="/signup" onClick={closeMenu}>Sign Up</SignUpButton>
              </UserSection>
            )}
          </Nav>
        </HeaderContent>
      </HeaderContainer>
      <Overlay $isOpen={isMenuOpen} onClick={closeMenu} />
    </StyledHeader>
  );
};

export default Header;
