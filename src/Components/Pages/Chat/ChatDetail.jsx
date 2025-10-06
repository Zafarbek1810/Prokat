import React, { useEffect, useState } from "react";
import { Modal, Typography, Button, Avatar, Spin, message, Popconfirm, Image } from "antd";
import { ArrowLeftOutlined, UserOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import ChatProvider from "../../../Data/ChatProvider";

const ChatDetail = ({ 
  isOpen, 
  setIsOpen, 
  chatId, 
  participantPhones,
  flagCount,
  isArchived 
}) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingMessageId, setDeletingMessageId] = useState(null);

  useEffect(() => {
    if (isOpen && chatId) {
      fetchChatMessages();
    }
  }, [isOpen, chatId]);

  const fetchChatMessages = async () => {
    setLoading(true);
    try {
      const response = await ChatProvider.getOneChat(chatId);
      setMessages(response.data);
    } catch (error) {
      console.error("Chat ma'lumotlarini olishda xatolik:", error);
      message.error("Chat ma'lumotlarini olishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const formatPhone = (phone) => {
    if (phone?.includes('deleted_')) {
      return phone.split('_').pop();
    }
    return phone;
  };

  const isDeletedUser = (phone) => {
    return phone?.includes('deleted_');
  };

  // Ishtirokchilarni aniqlash va xabarlarni ajratish
  const getParticipants = () => {
    if (!participantPhones || participantPhones.length < 2) return { first: null, second: null };
    
    return {
      first: participantPhones[0],
      second: participantPhones[1]
    };
  };

  const getMessageAlignment = (senderPhone) => {
    const participants = getParticipants();
    
    // Agar foydalanuvchi o'chirilgan bo'lsa, asl telefon raqamini olish
    const originalPhone = senderPhone?.includes('deleted_') 
      ? senderPhone.split('_').pop() 
      : senderPhone;
    
    // Birinchi ishtirokchi - chap tomonda
    if (originalPhone === participants.first) {
      return 'left';
    }
    // Ikkinchi ishtirokchi - o'ng tomonda  
    else if (originalPhone === participants.second) {
      return 'right';
    }
    // Agar ishtirokchi ro'yxatida yo'q bo'lsa, chap tomonda qoldirish
    return 'left';
  };

  const handleDeleteMessage = async (messageId) => {
    setDeletingMessageId(messageId);
    try {
      await ChatProvider.deleteMessageInChat(chatId, messageId);
      message.success("Xabar o'chirildi!");
      // Xabarlar ro'yxatini yangilash
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
    } catch (error) {
      console.error("Xabarni o'chirishda xatolik:", error);
      message.error("Xabarni o'chirishda xatolik yuz berdi");
    } finally {
      setDeletingMessageId(null);
    }
  };

  return (
    <>
      <style jsx>{`
        .custom-image-preview-mask {
          background: rgba(0, 0, 0, 0.5) !important;
          color: white !important;
          font-size: 14px !important;
          font-weight: 500 !important;
        }
        .custom-image-preview-mask:hover {
          background: rgba(0, 0, 0, 0.7) !important;
        }
      `}</style>
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={() => setIsOpen(false)}
              style={{ padding: '4px 8px' }}
            />
            <div>
              <Typography.Title level={4} style={{ margin: 0 }}>
                Chat ma'lumotlari
              </Typography.Title>
              <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                {participantPhones?.[0]} va {participantPhones?.[1]}
              </Typography.Text>
            </div>
          </div>
        }
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        width={800}
        footer={null}
        style={{ top: 20 }}
      >
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        {/* <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <Typography.Text strong>Shikoyatlar soni: </Typography.Text>
          <Typography.Text>{flagCount}</Typography.Text>
        </div> */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography.Text strong>Holat: </Typography.Text>
          <Typography.Text style={{ 
            color: isArchived ? '#faad14' : '#52c41a',
            fontWeight: 'bold'
          }}>
            {isArchived ? 'Arxivlangan' : 'Faol'}
          </Typography.Text>
        </div>
      </div>

      <div style={{ 
        height: '500px', 
        overflowY: 'auto', 
        border: '1px solid #d9d9d9', 
        borderRadius: '8px',
        padding: '10px',
        background: '#fafafa'
      }}>
        {loading ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '200px' 
          }}>
            <Spin size="large" />
          </div>
        ) : messages.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '50px',
            color: '#999'
          }}>
            <Typography.Text>Bu chatda xabar yo'q</Typography.Text>
          </div>
        ) : (
          messages.map((message) => {
            const alignment = getMessageAlignment(message.sender_phone);
            const isLeft = alignment === 'left';
            const participants = getParticipants();
            
            return (
              <div
                key={message.id}
                style={{
                  marginBottom: '15px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isLeft ? 'flex-start' : 'flex-end'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  marginBottom: '5px',
                  flexDirection: isLeft ? 'row' : 'row-reverse'
                }}>
                  <Avatar 
                    size="small" 
                    icon={<UserOutlined />}
                    style={{ 
                      backgroundColor: isDeletedUser(message.sender_phone) ? '#ff4d4f' : (isLeft ? '#52c41a' : '#1890ff')
                    }}
                  />
                  <Typography.Text 
                    style={{ 
                      fontSize: '12px',
                      color: '#666',
                      fontWeight: 'bold'
                    }}
                  >
                    {isDeletedUser(message.sender_phone) 
                      ? 'O\'chirilgan foydalanuvchi' 
                      : (isLeft ? `Ishtirokchi 1 (${formatPhone(message.sender_phone)})` : `Ishtirokchi 2 (${formatPhone(message.sender_phone)})`)
                    }
                  </Typography.Text>
                  <Typography.Text style={{ fontSize: '11px', color: '#999' }}>
                    {moment(message.created_at).format('DD.MM.YYYY HH:mm')}
                  </Typography.Text>
                </div>
                
                <div
                  style={{
                    maxWidth: '70%',
                    padding: '10px 15px',
                    borderRadius: isLeft ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                    backgroundColor: isLeft ? '#f0f0f0' : '#1890ff',
                    color: isLeft ? '#333' : '#fff',
                    border: isLeft ? '1px solid #d9d9d9' : 'none',
                    wordWrap: 'break-word',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography.Text 
                      style={{ 
                        color: isLeft ? '#333' : '#fff',
                        fontSize: '14px',
                        flex: 1,
                        marginRight: '10px'
                      }}
                    >
                      {message.content}
                    </Typography.Text>
                    
                    <Popconfirm
                      title="Xabarni o'chirish"
                      description="Haqiqatdan bu xabarni o'chirmoqchimisiz?"
                      onConfirm={() => handleDeleteMessage(message.id)}
                      okText="Ha"
                      cancelText="Yo'q"
                      okButtonProps={{ 
                        loading: deletingMessageId === message.id,
                        danger: true 
                      }}
                    >
                      <Button
                        type="text"
                        size="small"
                        icon={<DeleteOutlined />}
                        style={{
                          color: isLeft ? '#ff4d4f' : '#fff',
                          opacity: 0.7,
                          padding: '2px 4px',
                          minWidth: 'auto',
                          height: 'auto'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.opacity = '1';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.opacity = '0.7';
                        }}
                      />
                    </Popconfirm>
                  </div>
                  
                  {message.media_url && (
                    <div style={{ marginTop: '8px' }}>
                      {message.media_type === 'image' ? (
                        <Image
                          src={message.media_url}
                          alt="Media"
                          style={{
                            maxWidth: '100%',
                            borderRadius: '8px',
                            maxHeight: '200px',
                            objectFit: 'cover'
                          }}
                          preview={{
                            mask: 'Kattalashtirish',
                            maskClassName: 'custom-image-preview-mask'
                          }}
                          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3QoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                        />
                      ) : message.media_type === 'video' ? (
                        <video 
                          src={message.media_url} 
                          controls 
                          style={{ 
                            maxWidth: '100%', 
                            borderRadius: '8px',
                            maxHeight: '200px'
                          }} 
                        />
                      ) : (
                        <a 
                          href={message.media_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ 
                            color: isLeft ? '#1890ff' : '#fff',
                            textDecoration: 'underline'
                          }}
                        >
                          Faylni yuklab olish
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
      </Modal>
    </>
  );
};

export default ChatDetail;