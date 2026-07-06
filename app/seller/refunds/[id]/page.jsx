import React from 'react'

import { getUser } from "@/app/_lib/auth";
import { getUserInfo } from "@/app/_lib/data-services";
import { getOneRefund } from "@/app/_lib/data-services";
import { RefundAction } from "@/app/_lib/refund-action";
import Image from 'next/image';


import styles from './refund.module.css'
import ChatSpace from '@/app/_components/ChatSpace/ChatSpace';






const Refund = async ({ params }) => {

    
    const user = await getUser();

    const { id } = await params;
    const oneRefund = await getOneRefund(id);

    const order = oneRefund.ORDERS_T;
    const buyer = order.buyer;
    const orderItem = order.ORDER_ITEMS_T;

    let status = 'Pending';
    let isResponse = false;
    let statStyle = 'Pending';

    if (oneRefund.admin_status === 'Approved' || oneRefund.admin_status === 'Rejected') {
      status = oneRefund.admin_status + ' by admin';
      isResponse = true;
      statStyle = oneRefund.admin_status;
      
    }else if (oneRefund.seller_status === 'Approved' || oneRefund.seller_status === 'Rejected'){
      status = oneRefund.seller_status;
      isResponse = true;
      statStyle = oneRefund.seller_status;
    }


    const evidences = Array.isArray(oneRefund.evidences) 
        ? oneRefund.evidences 
        : JSON.parse(oneRefund.evidences || '[]');



  return (
<div className={styles.fcon}>

  <a href="/seller/refunds" className={styles.backBtn} style={{ textDecoration: 'none' }}>← Back</a>

  <form action={RefundAction} className={styles.fcon}>
      
      <input type="hidden" name="refund_id" value={oneRefund.refund_id} />
      <input type="hidden"   
                name="seller_remarks" 
                
                className={styles.remark} 
              /> 


      
      <div className={styles.upCon}>

        
        <div className={styles.actionContainer}>

          {statStyle === 'Pending' && (
                <div className={styles.response}>
                    <button type="submit" name="action" value="Rejected" className={`${styles.btn} ${styles.btnReject}`}>
                        Reject Refund
                    </button>
                    <button type="submit" name="action" value="Approved" className={`${styles.btn} ${styles.btnAccept}`}>
                        Approve Refund
                    </button>
                </div>
            )}

            <a href={`/seller/chat?id=${buyer.user_id}`}><button type="button" className={`${styles.btn} ${styles.btnContact}`}>Contact Buyer</button>
            </a>
            



        </div>

      </div>

            </form>

      


      
        <h1 className={styles.heading}>Refund Request</h1>
        <p className={styles.id}>Order ID : {oneRefund.order_id} </p>
        <br />
        <div className={`${styles.status} ${styles[statStyle]}`}>
          {status}
        </div>


      <div className={styles.topGrid}>
        

        <div className={styles.left}>

          <div className={styles.card}>
            <p className={styles.profileTitle}>
              <Image src={buyer.avatar} alt={buyer.username} width={60} height={60} className={styles.profileAvatar} />
            </p>

            <h2 className={styles.profileName}>{buyer.username}</h2>

            <div className={`${styles.infoRow} ${styles.idUserRow}`}>
              <span>Buyer Id</span>
              <span>{buyer.user_id}</span>
            </div>

            <div className={styles.infoRow}>
              <span>Contact</span>
              <span>{buyer.contact_number || '-'}</span>
            </div>

            <div className={styles.infoRow}>
              <span>Email</span>
              <span>{buyer.email || ''}</span>
            </div>

          </div>


          <div className={styles.card}>

            <h3 className={styles.cardTitle}>Evidence</h3>

            <p><span className={styles.subject}>Subject:</span> {oneRefund.refund_subject}</p>

            <br />

            <p>{oneRefund.refund_description}</p>
            <br />

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {evidences.length > 0 ? (
                    evidences.map((url, index) => (
                        <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                            <img 
                                src={url} 
                                alt={`Evidence ${index + 1}`} 
                                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ccc' }} 
                            />
                        </a>
                    ))
                ) : (
                    <p style={{ color: 'gray', fontSize: '14px' }}>No evidence provided.</p>
                )}
            </div>

          </div>
        </div>

        <div className={styles.right}>

        <div className={styles.splitCard}>
          
          <div className={styles.timelineSection}>

            <h1 className={styles.cardTitle}>Order Timeline</h1>

            <div className={styles.timeline}>

              <div className={styles.timelineItem}>

                <div className={styles.timelineDot}>

                </div>

                <div className={styles.timelineContent}>

                  <h4>Order Placed :</h4>
                  <p>{order.order_temp_date}</p>

                </div>
              </div>

              <div className={styles.timelineItem}>

                <div className={styles.timelineDot}>

                </div>
                
                <div className={styles.timelineContent}>

                  <h4>Payment Successful :</h4>
                  <p></p>

                </div>
              </div>

              <div className={styles.timelineItem}>

                <div className={styles.timelineDot}>

                </div>

                <div className={styles.timelineContent}>

                  <h4>Shipped :</h4>
                  <p></p>

                </div>
              </div>

              <div className={styles.timelineItem}>
                <div className={styles.timelineDot}>

                </div>
                <div className={styles.timelineContent}>

                  <h4>Arrived :</h4>
                  <p></p>

                </div>
              </div>

              <div className={styles.timelineItem}>
                <div className={`${styles.timelineDot} ${styles.inactive}`}>

                </div>
                <div className={styles.timelineContent}>

                  <h4>Refund Request :</h4>
                  <p>{oneRefund.temp_date}</p>

                </div>
              </div>

            </div>
          </div>


          <div className={styles.chatSection}>

            <div className={styles.chatCon}>

                <ChatSpace id={buyer.user_id} />
            </div>
            

          </div>


          

        </div>

        <div className={styles.card}>

            <h3 className={styles.cardTitle}>Remarks</h3>

            { statStyle !== 'Pending' ? (
              <p>{(oneRefund.seller_remarks || oneRefund.admin_remarks) || ''}</p>
            ) : (
              <textarea 
                type="text-box" 
                name="seller_remarks" 
                placeholder="Enter remarks for this decision..." 
                className={styles.remark} 
                required 
              />
            )}
            


          </div>
        </div>




      </div>



      <h2 className={styles.orderTitle}>Order Details</h2>

      <p className={styles.orderTotal}>Order Total : RM 1123</p>

          <div className={styles.orderCon}>

          <div className={styles.orderSecCon}>

      <div className={styles.productList}>

        {orderItem.map((item, index) => {
          const variant = item.PRODUCT_VARIANTS_T || {};
          const product = variant.PRODUCTS_T || {};

          return (

                  <div className={styles.productItem} key={index}>

                    <div className={styles.productImage}>
                      <img src={product.product_image_url} alt="product" />
                    </div>
                    <div className={styles.productDetails}>

                      <div className={styles.detailRow}>

                        <span className={styles.detailLabel}>Product</span>
                        <span className={styles.detailDetail}>{product.product_name}</span>

                      </div>
                      <div className={styles.detailRow}>

                        <span className={styles.detailLabel}>SKU</span>
                        <span className={styles.detailDetail}>{variant.sku}</span>

                      </div>
                      <div className={styles.detailRow}>

                        <span className={styles.detailLabel}>Quantity</span>
                        <span className={styles.detailDetail}>{item.quantity}</span>

                      </div>
                      <div className={styles.detailRow}>

                        <span className={styles.detailLabel}>Price</span>
                        <span className={styles.detailDetail}>RM {item.unit_price}</span>

                      </div>
                    </div>
                  </div>
          )
            })}

    </div>

    </div>


      </div>

    


    </div>
  )
}

export default Refund