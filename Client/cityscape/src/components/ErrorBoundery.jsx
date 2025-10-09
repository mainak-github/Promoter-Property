import React from 'react';
import { Alert, Button, Card, Typography } from 'antd';
import { BugOutlined, ReloadOutlined, HomeOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log to console for debugging
    console.error('🚨 Error caught by ErrorBoundary:', error);
    console.error('📍 Error info:', errorInfo);
    
    // You can also send to error reporting service like Sentry
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '50px', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#f0f2f5'
        }}>
          <Card style={{ maxWidth: 600, textAlign: 'center' }}>
            <BugOutlined style={{ fontSize: '64px', color: '#ff4d4f', marginBottom: '16px' }} />
            
            <Title level={2} type="danger">
              Oops! Something went wrong
            </Title>
            
            <Alert
              message="Error Details"
              description={
                <div>
                  <Paragraph strong>
                    {this.state.error && this.state.error.toString()}
                  </Paragraph>
                  
                  {/* Show detailed error in development mode */}
                  {process.env.NODE_ENV === 'development' && (
                    <details style={{ marginTop: '16px', textAlign: 'left' }}>
                      <summary>Technical Details (Development Only)</summary>
                      <pre style={{ 
                        whiteSpace: 'pre-wrap', 
                        fontSize: '12px', 
                        background: '#f5f5f5', 
                        padding: '10px',
                        marginTop: '10px',
                        maxHeight: '200px',
                        overflow: 'auto'
                      }}>
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              }
              type="error"
              showIcon
              style={{ marginBottom: '24px' }}
            />

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Button 
                type="primary" 
                icon={<ReloadOutlined />}
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
              
              <Button 
                icon={<HomeOutlined />}
                onClick={() => window.location.href = '/'}
              >
                Go Home
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
