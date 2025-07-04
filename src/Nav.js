import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Nav() {
    const { pathname } = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [navLinks, setNavLinks] = useState([]);

    const navStyle = {
        width: '100%',
        background: '#424242',
        display: 'block',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        padding: '0.5rem 0',
        marginBottom: 0,
        zIndex: 20,
        position: 'sticky',
        top: 0
    };

    const containerStyle = {
        display: 'flex',
        alignItems: 'center',
        maxWidth: 1200,
        paddingLeft: '1rem',
        paddingRight: '1rem',
        justifyContent: 'flex-start',
        position: 'relative'
    };

    const hamburgerButtonStyle = {
        background: 'none',
        border: 'none',
        padding: 0,
        marginRight: '1rem',
        cursor: 'pointer',
        width: 40,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    const hamburgerContainerStyle = {
        display: 'block',
        width: 28,
        height: 22,
        position: 'relative'
    };

    const hamburgerLineStyle = {
        display: 'block',
        height: 4,
        width: 28,
        background: '#4caf50',
        borderRadius: 2,
        position: 'absolute',
        left: 0,
        transition: '0.2s'
    };

    const titleContainerStyle = {
        flex: 1,
        display: 'flex',
        alignItems: 'center'
    };

    const titleStyle = {
        color: '#ffffff',
        fontWeight: 500,
        marginLeft: 10
    };

    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.18)',
        zIndex: 1000
    };

    const mobileMenuStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 220,
        background: '#616161',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
        borderRadius: '0 0 12px 0',
        padding: '1.2rem 0.5rem 1.2rem 1.2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    };

    const baseLinkStyle = {
        fontWeight: 500,
        fontSize: '1.08rem',
        textDecoration: 'none',
        padding: '0.7rem 1rem',
        borderRadius: '18px',
        transition: 'all 0.3s ease',
        letterSpacing: '0.01em',
        outline: 'none',
        border: 'none',
        cursor: 'pointer',
        position: 'relative'
    };

    const getNavLinkStyle = (active) => ({
        ...baseLinkStyle,
        color: active ? '#4caf50' : '#ffffff',
        background: active ? 'rgba(76, 175, 80, 0.15)' : 'none',
        boxShadow: active ? '0 2px 4px 0 rgba(76,175,80,0.20)' : 'none'
    });

    useEffect(() => {
        setNavLinks([
            { to: "/spell-list", label: "Spell List" },
            { to: "/character-list", label: "Character List" },
            { to: "/initiative", label: "Initiative" }
        ]);
    }, [pathname]);

    return (
        <nav style={navStyle}>
            <div style={containerStyle}>
                <button
                    aria-label="Open navigation"
                    onClick={() => setMobileOpen(v => !v)}
                    style={hamburgerButtonStyle}
                >
                    <span style={hamburgerContainerStyle}>
                        <span style={{ ...hamburgerLineStyle, top: 0 }} />
                        <span style={{ ...hamburgerLineStyle, top: 9 }} />
                        <span style={{ ...hamburgerLineStyle, top: 18 }} />
                    </span>
                </button>
                <div style={titleContainerStyle}>
                    <span style={titleStyle}>
                        {navLinks.find(l => l.to === pathname)?.label}
                    </span>
                </div>
                {mobileOpen && (
                    <div style={overlayStyle} onClick={() => setMobileOpen(false)}>
                        <div style={mobileMenuStyle} onClick={e => e.stopPropagation()}>
                            {navLinks.map(({ to, label }) => {
                                const active = pathname === to;
                                return (
                                    <Link
                                        key={to}
                                        to={to}
                                        onClick={() => setMobileOpen(false)}
                                        style={getNavLinkStyle(active)}
                                        tabIndex={0}
                                    >
                                        {label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Nav;